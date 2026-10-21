import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const production =
		site && !["localhost", "127.0.0.1"].includes(site.hostname);
	return new Response(
		`User-agent: *\nAllow: /\nDisallow: /api/\n${production ? `Sitemap: ${new URL("sitemap-index.xml", site).href}\n` : ""}`,
		{ headers: { "Content-Type": "text/plain; charset=utf-8" } },
	);
};
