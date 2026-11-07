<div align="center">

# Tiga Searah

**Beda Ayah, Satu Arah.**  
Website digital studio berbasis monorepo untuk showcase karya, layanan studio, dan formulir permintaan proyek interaktif.

[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r180-black?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Nitro](https://img.shields.io/badge/Nitro-Server-F43F5E?style=flat-square&logo=nuxtdotjs&logoColor=white)](https://nitro.unjs.io/)
[![Bun](https://img.shields.io/badge/Bun-1.4.3-FBF0DF?style=flat-square&logo=bun&logoColor=black)](https://bun.sh/)

</div>

---

## Ringkasan Proyek

Tiga Searah dirancang dengan arsitektur monorepo performa tinggi:

- **Frontend statis ultra-cepat** dengan Astro dan styling modern Tailwind CSS v4.
- **Hero visual 3D interaktif** memanfaatkan Three.js dan transisi ElysiaJS mask.
- **Formulir kontak reaktif** menggunakan React 19 + Zod schema validation.
- **Backend API decoupled** menggunakan Nitro server yang mengintegrasikan Resend untuk penerimaan email aman berkecepatan tinggi.

---

## Arsitektur Monorepo

```
tiga-searah/
├── apps/
│   ├── web/              # Astro static site frontend + Three.js + React contact island
│   └── api/              # Nitro HTTP server (endpoint POST /api/contact + Resend email)
├── packages/
│   └── shared/           # Zod schema & contracts yang dipakai web dan api
├── scripts/
│   └── dev.ts            # Script runner concurrent dev environment
└── turbo.json            # Orkestrasi build monorepo Turborepo
```

### Stack Teknologi

| Komponen               | Teknologi                                                                    |
| :--------------------- | :--------------------------------------------------------------------------- |
| **Workspace & PM**     | Turborepo, Bun Workspaces                                                    |
| **Frontend Framework** | [Astro 7](https://astro.build/)                                              |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/) (CSS variables & modern utility) |
| **Interactive 3D**     | [Three.js](https://threejs.org/), [GSAP](https://greensock.com/gsap/)        |
| **UI Island**          | [React 19](https://react.dev/) (Formulir Kontak)                             |
| **Backend & API**      | [Nitro](https://nitro.unjs.io/) (H3 Event Handler)                           |
| **Validation**         | [Zod 4](https://zod.dev/)                                                    |
| **Email Service**      | [Resend](https://resend.com/)                                                |
| **Lint & Format**      | [Biome](https://biomejs.dev/)                                                |

---

## Kebutuhan Sistem

- **Bun**: `>= 1.4.3` (Package manager utama)
- **Node.js**: `>= 22.12.0` (Dibutuhkan untuk compiler Astro)

---

## Panduan Memulai

### 1. Kloning Repositori

```bash
git clone https://github.com/tiga-searah/tiga-searah.git
cd tiga-searah
```

### 2. Instal Dependensi

```bash
bun install
```

### 3. Menjalankan Mode Development

Jalankan kedua aplikasi (`web` dan `api`) secara paralel:

```bash
bun run dev
```

- **Frontend (Web)**: [http://127.0.0.1:4321](http://127.0.0.1:4321)
- **Backend API**: [http://127.0.0.1:3001](http://127.0.0.1:3001)

---

## Perintah CLI

| Perintah           | Deskripsi                                                  |
| :----------------- | :--------------------------------------------------------- |
| `bun run dev`      | Menjalankan server dev Web (Astro) & API (Nitro) bersamaan |
| `bun run build`    | Build seluruh aplikasi monorepo via Turborepo              |
| `bun run check`    | Typecheck TypeScript & Astro template                      |
| `bun run lint`     | Cek dan autofix kode dengan Biome                          |
| `bun run format`   | Format ulang semua file dengan Biome                       |
| `bun run test`     | Menjalankan unit test dengan Vitest                        |
| `bun run test:e2e` | Menjalankan pengujian e2e dengan Playwright                |

---
