import type { ContactData } from "@tiga-searah/shared/contact";

export function escapeHTML(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(character) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				character
			]!,
	);
}

export function buildEmail(data: ContactData, receivedAt = new Date()) {
	const rows = [
		["Nama", data.name],
		["Email", data.email],
		["Organisasi", data.company || "Tidak diisi"],
		["Layanan", data.service],
		["Anggaran", data.budget || "Belum ditentukan"],
		["Target waktu", data.timeline || "Belum ditentukan"],
		["Deskripsi", data.message],
		["Diterima (UTC)", receivedAt.toISOString()],
	];
	return {
		subject: `[Tiga Searah] New Project Inquiry — ${data.service}`,
		text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
		html: `<html lang="id"><body style="background:#f3f5f7;padding:30px;font-family:Arial,sans-serif;color:#172333"><h1 style="font-size:24px">Permintaan proyek baru</h1><p>Tiga Searah — Beda Ayah, Satu Arah.</p><table style="background:#fff;border-collapse:collapse;max-width:680px;width:100%">${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:14px;border-bottom:1px solid #ddd">${escapeHTML(label)}</th><td style="padding:14px;border-bottom:1px solid #ddd;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHTML(value)}</td></tr>`).join("")}</table></body></html>`,
	};
}
