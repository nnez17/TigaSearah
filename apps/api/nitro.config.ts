import { defineNitroConfig } from "nitropack/config";

const isHttps = process.env.CONTACT_ALLOWED_ORIGIN?.startsWith("https://");

export default defineNitroConfig({
	preset: "node-server",
	compatibilityDate: "2026-10-15",
	srcDir: "server",
	publicAssets: [{ dir: "../../web/dist", maxAge: 0 }],
	routeRules: {
		"/**": {
			headers: {
				"x-content-type-options": "nosniff",
				"x-frame-options": "DENY",
				"referrer-policy": "strict-origin-when-cross-origin",
				"permissions-policy": "camera=(), microphone=(), geolocation=()",
				"content-security-policy":
					"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
				...(isHttps
					? {
							"strict-transport-security":
								"max-age=31536000; includeSubDomains",
						}
					: {}),
			},
		},
		"/api/**": { headers: { "cache-control": "no-store" } },
		"/_astro/**": {
			headers: { "cache-control": "public, max-age=31536000, immutable" },
		},
	},
});
