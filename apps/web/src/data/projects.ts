export const projects = [
	{
		slug: "xirpl",
		name: "XI RPL",
		category: "Class Portal & Web App",
		summary: "Satu ruang untuk jadwal, jurnal kebiasaan, dan cerita kelas.",
		problem:
			"Informasi kelas, jadwal, dokumentasi kegiatan, dan pencatatan kebiasaan perlu dapat diakses dari satu tempat oleh anggota kelas XI RPL SMKN 1 Kandeman.",
		solution:
			"Portal kelas menggabungkan jadwal pelajaran dan piket, album kegiatan, jurnal kebiasaan, serta check-in harian. Halaman publik memperkenalkan kelas; fitur akun dan pencatatan didukung API terpisah.",
		contribution:
			"Pengembangan portal kelas dan API dalam satu monorepo: antarmuka responsif, integrasi autentikasi Google, skema data, jurnal, check-in, dan penyimpanan gambar. Cakupan ini tercatat dalam repositori publik Tiga Searah.",
		tech: [
			"Next.js",
			"React",
			"Tailwind CSS",
			"ElysiaJS",
			"Drizzle ORM",
			"PostgreSQL",
			"Bun",
		],
		live: "https://xirpl.tigasearah.my.id/",
		repo: "https://github.com/tiga-searah/xirpl",
		image: "/images/xirpl-desktop.webp",
		mobileImage: "/images/xirpl-mobile.webp",
		theme: "sky",
		width: 1271,
		height: 715,
	},
	{
		slug: "forum-mpk-skansaka",
		name: "Forum MPK Skansaka",
		category: "School Organization Platform",
		summary: "Jembatan digital antara suara siswa dan perwakilan kelas.",
		problem:
			"MPK SMKN 1 Kandeman membutuhkan ruang digital untuk memperkenalkan organisasi, membagikan informasi, dan menghubungkan siswa dengan kanal penyampaian aspirasi.",
		solution:
			"Website menyajikan profil MPK, struktur pengurus dan komisi, berita, serta monitoring aspirasi. Tombol pada halaman publik mengarah ke formulir aspirasi; area admin mendukung pengelolaan konten dan data organisasi.",
		contribution:
			"Pengembangan website organisasi dengan SvelteKit, antarmuka responsif, halaman berita, struktur pengurus, serta backend dan area admin. Integrasi data menggunakan Firebase dan penyimpanan gambar melalui Vercel Blob, sebagaimana didokumentasikan dalam repositori.",
		tech: [
			"SvelteKit",
			"Svelte",
			"Tailwind CSS",
			"ElysiaJS",
			"Firebase",
			"Vercel Blob",
			"Bun",
		],
		live: "https://mpkskansaka.vercel.app/",
		repo: "https://github.com/tiga-searah/forum-mpk-skansaka",
		image: "/images/mpk-desktop.webp",
		mobileImage: "/images/mpk-mobile.webp",
		theme: "navy",
		width: 1430,
		height: 959,
	},
] as const;
