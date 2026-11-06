import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { contactSchema, services } from "@tiga-searah/shared/contact";

type Errors = Partial<Record<string, string>>;
export default function ContactForm() {
	const [service, setService] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");
	const [notice, setNotice] = useState("");
	const inFlight = useRef(false);
	const controller = useRef<AbortController | null>(null);

	useEffect(() => {
		const select = (value: string | null) => {
			if (services.includes(value as (typeof services)[number]))
				setService(value!);
		};
		select(new URLSearchParams(location.search).get("service"));
		const handle = (event: Event) =>
			select((event as CustomEvent<string>).detail);
		window.addEventListener("select-service", handle);
		return () => {
			window.removeEventListener("select-service", handle);
			controller.current?.abort();
		};
	}, []);

	async function submit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		if (inFlight.current) return;
		const form = event.currentTarget;
		const formData = new FormData(form);
		const result = contactSchema.safeParse({
			...Object.fromEntries(formData),
			consent: formData.get("consent") === "on",
		});
		if (!result.success) {
			const nextErrors: Errors = {};
			result.error.issues.forEach((issue) => {
				nextErrors[String(issue.path[0])] ??= issue.message;
			});
			setErrors(nextErrors);
			setStatus("idle");
			setNotice("Periksa kembali kolom yang ditandai.");
			const field = form.elements.namedItem(Object.keys(nextErrors)[0]);
			if (field instanceof HTMLElement) field.focus();
			return;
		}
		setErrors({});
		setStatus("submitting");
		setNotice("");
		inFlight.current = true;
		const payload = JSON.stringify(result.data);
		controller.current = new AbortController();
		const timeout = setTimeout(() => controller.current?.abort(), 20000);
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload,
				signal: controller.current.signal,
			});
			const data = await response.json();
			if (!response.ok || data.success !== true) {
				setErrors(data.errors || {});
				throw new Error(
					data.message ||
						"Pesan belum terkirim. Coba lagi atau hubungi kami lewat email.",
				);
			}
			setStatus("success");
			setNotice(
				"Pesanmu sudah terkirim. Terima kasih sudah berbagi ide. Kami akan membalas melalui emailmu.",
			);
			form.reset();
			setService("");
		} catch (error) {
			setStatus("error");
			setNotice(
				error instanceof Error && error.name !== "AbortError"
					? error.message
					: "Koneksi terputus atau waktu tunggu habis. Isianmu tetap tersimpan di formulir. Coba lagi atau kirim email langsung.",
			);
		} finally {
			clearTimeout(timeout);
			inFlight.current = false;
		}
	}

	const errorProps = (field: string) => ({
		"aria-invalid": !!errors[field],
		"aria-describedby": errors[field] ? `${field}-error` : undefined,
	});
	const error = (field: string) =>
		errors[field] ? (
			<span className="field-error" id={`${field}-error`}>
				{errors[field]}
			</span>
		) : null;

	return (
		<form
			className="contact-form"
			method="post"
			action="/api/contact"
			onSubmit={submit}
			noValidate
			aria-label="Formulir permintaan proyek"
			aria-busy={status === "submitting"}
		>
			<p className="form-heading">
				Mulai dari sebuah percakapan.<span>* Wajib diisi</span>
			</p>
			<div className="form-grid">
				<div className="form-field">
					<label htmlFor="name">
						Nama kamu <span>*</span>
					</label>
					<input
						id="name"
						name="name"
						autoComplete="name"
						placeholder="Nama lengkap"
						required
						maxLength={100}
						{...errorProps("name")}
					/>
					{error("name")}
				</div>
				<div className="form-field">
					<label htmlFor="email">
						Email <span>*</span>
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="kamu@email.com"
						required
						maxLength={254}
						{...errorProps("email")}
					/>
					{error("email")}
				</div>
				<div className="form-field">
					<label htmlFor="company">
						Bisnis / organisasi <span className="optional">Opsional</span>
					</label>
					<input
						id="company"
						name="company"
						autoComplete="organization"
						placeholder="Nama bisnis atau organisasi"
						maxLength={150}
						{...errorProps("company")}
					/>
					{error("company")}
				</div>
				<div className="form-field">
					<label htmlFor="service">
						Yang kamu butuhkan <span>*</span>
					</label>
					<select
						id="service"
						name="service"
						required
						value={service}
						onChange={(event) => setService(event.target.value)}
						{...errorProps("service")}
					>
						<option value="" disabled>
							Pilih layanan
						</option>
						{services.map((item) => (
							<option key={item} value={item}>
								{item === "Other / Not Sure Yet"
									? "Lainnya / Belum yakin"
									: item}
							</option>
						))}
					</select>
					{error("service")}
				</div>
				<div className="form-field">
					<label htmlFor="budget">
						Gambaran anggaran <span className="optional">Opsional</span>
					</label>
					<input
						id="budget"
						name="budget"
						placeholder="Boleh kita diskusikan dulu"
						maxLength={100}
						{...errorProps("budget")}
					/>
					{error("budget")}
				</div>
				<div className="form-field">
					<label htmlFor="timeline">
						Target waktu <span className="optional">Opsional</span>
					</label>
					<input
						id="timeline"
						name="timeline"
						placeholder="Kapan ingin mulai atau selesai?"
						maxLength={150}
						{...errorProps("timeline")}
					/>
					{error("timeline")}
				</div>
				<div className="form-field full-width">
					<label htmlFor="message">
						Ceritakan idemu <span>*</span>
					</label>
					<textarea
						id="message"
						name="message"
						rows={4}
						placeholder="Tentang proyek, tujuan, dan hal yang ingin kamu wujudkan…"
						required
						minLength={20}
						maxLength={5000}
						{...errorProps("message")}
					/>
					{error("message")}
				</div>
			</div>
			<div className="honeypot" aria-hidden="true">
				<label htmlFor="website">Website</label>
				<input id="website" name="website" tabIndex={-1} autoComplete="off" />
			</div>
			<label className="consent-label">
				<input
					name="consent"
					type="checkbox"
					required
					{...errorProps("consent")}
				/>
				<span>
					Saya setuju data ini digunakan untuk menanggapi kebutuhan proyek
					sesuai <a href="/privacy-policy/">kebijakan privasi</a>.
				</span>
			</label>
			{error("consent")}
			<button
				className="button button-blue form-submit"
				type="submit"
				disabled={status === "submitting"}
			>
				{status === "submitting" ? "Mengirim pesan…" : "Kirim cerita proyekmu"}
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					aria-hidden="true"
				>
					<path d="M7 17 17 7M7 7h10v10" />
				</svg>
			</button>
			<div
				className={`form-notice ${status}`}
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{notice}
				{status === "error" && (
					<a href="mailto:trio.searah@gmail.com">
						Email trio.searah@gmail.com ↗
					</a>
				)}
			</div>
			<noscript>
				<p>
					Formulir membutuhkan JavaScript. Kirim kebutuhan proyek langsung ke{" "}
					<a href="mailto:trio.searah@gmail.com">trio.searah@gmail.com</a>.
				</p>
			</noscript>
		</form>
	);
}
