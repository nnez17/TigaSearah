import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

process.env.ASTRO_TELEMETRY_DISABLED = "1";

if (typeof process.loadEnvFile === "function") {
	try {
		process.loadEnvFile(new URL("../../.env", import.meta.url));
	} catch {}
}

const site = process.env.SITE_URL;
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
