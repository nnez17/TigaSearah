import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(
	process.env.NODE_ENV || "development",
	fileURLToPath(new URL("../../", import.meta.url)),
	"",
);
const site = process.env.SITE_URL || env.SITE_URL;
if (site && !/^https?:\/\//.test(site))
	throw new Error("SITE_URL must be an absolute HTTP(S) URL.");

export default defineConfig({
	devToolbar: { enabled: false },
	site: site || "http://localhost:4321",
	integrations: [
		react(),
		...(site ? [sitemap({ filter: (page) => !page.endsWith("/404/") })] : []),
	],
	vite: {
		plugins: [tailwindcss()],
		server: { proxy: { "/api": "http://127.0.0.1:3001" } },
	},
});
