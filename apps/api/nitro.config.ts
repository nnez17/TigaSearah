import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
	preset: "node-server",
	compatibilityDate: "2026-10-15",
	srcDir: "server",
	publicAssets: [{ dir: "../../web/dist", maxAge: 0 }],
	routeRules: {
		"/api/**": { headers: { "cache-control": "no-store" } },
		"/_astro/**": {
			headers: { "cache-control": "public, max-age=31536000, immutable" },
		},
	},
});
