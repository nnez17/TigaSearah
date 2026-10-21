import { setResponseHeaders } from "h3";
import { defineNitroPlugin } from "nitropack/runtime";

export default defineNitroPlugin((nitro) => {
	nitro.hooks.hook("beforeResponse", (event) => {
		setResponseHeaders(event, {
			"x-content-type-options": "nosniff",
			"x-frame-options": "DENY",
			"referrer-policy": "strict-origin-when-cross-origin",
			"permissions-policy": "camera=(), microphone=(), geolocation=()",
			// Astro emits inline island bootstraps and JSON-LD; no third-party scripts are allowed.
			"content-security-policy":
				"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
			...(process.env.CONTACT_ALLOWED_ORIGIN?.startsWith("https://")
				? { "strict-transport-security": "max-age=31536000; includeSubDomains" }
				: {}),
		});
	});
});
