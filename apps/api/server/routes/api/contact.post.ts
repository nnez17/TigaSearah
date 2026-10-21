import {
	defineEventHandler,
	getHeader,
	getRequestIP,
	setResponseHeader,
	setResponseStatus,
} from "h3";
import { Resend } from "resend";
import { contactSchema } from "../../../../../shared/contact";
import { buildEmail } from "../../utils/email";
import { allowRequest } from "../../utils/rate-limit";

const MAX_BYTES = 16 * 1024;

export default defineEventHandler(async (event) => {
	const fail = (
		status: number,
		message: string,
		errors?: Record<string, string>,
	) => {
		setResponseStatus(event, status);
		return { success: false, message, ...(errors ? { errors } : {}) };
	};
	setResponseHeader(event, "Cache-Control", "no-store");
	const origin = getHeader(event, "origin");
	const configuredOrigin = process.env.CONTACT_ALLOWED_ORIGIN;
	const allowedOrigins = configuredOrigin
		? [configuredOrigin]
		: ["http://localhost:4321", "http://127.0.0.1:4321"];
	if (!origin || !allowedOrigins.includes(origin))
		return fail(403, "Permintaan tidak diizinkan.");
	if (
		getHeader(event, "content-type")?.split(";")[0].trim() !==
		"application/json"
	)
		return fail(415, "Gunakan application/json.");
	const declaredLength = Number(getHeader(event, "content-length") || 0);
	if (!Number.isFinite(declaredLength) || declaredLength > MAX_BYTES)
		return fail(413, "Pesan terlalu besar. Maksimal 16 KB.");
	const ip =
		getRequestIP(event, {
			xForwardedFor: process.env.TRUST_PROXY === "true",
		}) || "unknown";
	try {
		if (!(await allowRequest(ip, "contact", 5))) {
			setResponseHeader(event, "Retry-After", 600);
			return fail(
				429,
				"Terlalu banyak percobaan. Tunggu 10 menit atau hubungi kami lewat email.",
			);
		}
	} catch {
		return fail(
			503,
			"Layanan sementara tidak tersedia. Coba lagi atau kirim email langsung.",
		);
	}

	let body: unknown;
	try {
		const chunks: Buffer[] = [];
		let bytes = 0;
		for await (const chunk of event.node.req.iterator({
			destroyOnReturn: false,
		})) {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			bytes += buffer.length;
			if (bytes > MAX_BYTES) {
				event.node.req.resume();
				return fail(413, "Pesan terlalu besar. Maksimal 16 KB.");
			}
			chunks.push(buffer);
		}
		if (!bytes) return fail(400, "Pesan kosong.");
		body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		return fail(400, "Format pesan tidak valid.");
	}
	const validation = contactSchema.safeParse(body);
	if (!validation.success) {
		const errors: Record<string, string> = {};
		for (const issue of validation.error.issues)
			errors[String(issue.path[0] || "form")] ??= issue.message;
		return fail(400, "Periksa kembali isian formulirmu.", errors);
	}

	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM_EMAIL;
	if (!apiKey || !from)
		return fail(
			503,
			"Formulir belum terhubung ke layanan email. Hubungi trio.searah@gmail.com; isianmu tetap ada.",
		);
	const data = validation.data;
	try {
		const resend = new Resend(apiKey);
		const result = await resend.emails.send(
			{
				from,
				to: process.env.CONTACT_TO_EMAIL || "trio.searah@gmail.com",
				replyTo: data.email,
				...buildEmail(data),
			},
			{ signal: AbortSignal.timeout(10000) },
		);
		if (result.error || !result.data?.id) {
			console.error("[contact] Email provider rejected request");
			return fail(
				502,
				"Pesan belum terkirim. Coba lagi atau hubungi kami lewat email.",
			);
		}
		return {
			success: true,
			message: "Pesanmu sudah terkirim. Kami akan membalas melalui email.",
		};
	} catch {
		console.error("[contact] Email provider unavailable");
		return fail(
			502,
			"Pesan belum terkirim. Coba lagi atau hubungi kami lewat email.",
		);
	}
});
