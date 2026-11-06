import { z } from "zod";

export const services = [
	"Website Development",
	"Web Application",
	"Backend & API Integration",
	"Other / Not Sure Yet",
] as const;

const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max, `Maksimal ${max} karakter.`)
		.optional()
		.default("");

export const contactSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Nama minimal 2 karakter.")
			.max(100, "Nama maksimal 100 karakter.")
			.refine(
				(value) => !/[\r\n]/.test(value),
				"Nama tidak boleh memuat baris baru.",
			),
		email: z
			.string()
			.trim()
			.toLowerCase()
			.max(254)
			.pipe(z.email("Masukkan alamat email yang valid.")),
		company: optionalText(150),
		service: z.enum(services, { error: "Pilih layanan yang kamu butuhkan." }),
		budget: optionalText(100),
		timeline: optionalText(150),
		message: z
			.string()
			.trim()
			.min(20, "Ceritakan proyekmu dalam minimal 20 karakter.")
			.max(5000, "Deskripsi maksimal 5.000 karakter."),
		consent: z.literal(true, {
			error: "Persetujuan diperlukan untuk mengirim pesan.",
		}),
		website: z.string().max(0).optional().default(""),
	})
	.strict();

export type ContactData = z.infer<typeof contactSchema>;
