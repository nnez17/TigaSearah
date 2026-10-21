import { createHash } from "node:crypto";

const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const buckets = new Map<string, { count: number; reset: number }>();

export async function allowRequest(
	ip: string,
	bucket = "contact",
	limit = LIMIT,
	windowMs = WINDOW,
	now = Date.now(),
): Promise<boolean> {
	const redisURL = process.env.RATE_LIMIT_REDIS_URL;
	const redisToken = process.env.RATE_LIMIT_REDIS_TOKEN;
	const key = `${bucket}:${createHash("sha256").update(ip).digest("hex")}`;
	if (redisURL && redisToken) {
		// A single Redis Lua script keeps count and expiry atomic across instances.
		const script =
			"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]); end; return n";
		const response = await fetch(redisURL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${redisToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(["EVAL", script, 1, key, windowMs]),
			signal: AbortSignal.timeout(4000),
		});
		if (!response.ok) throw new Error("Rate limiter unavailable");
		const data = (await response.json()) as { result?: number; error?: string };
		if (typeof data.result !== "number" || data.error)
			throw new Error("Invalid rate limiter response");
		return data.result <= limit;
	}
	// ponytail: one long-running instance only; configure shared Redis before scaling out.
	for (const [id, entry] of buckets) if (entry.reset <= now) buckets.delete(id);
	const entry = buckets.get(key);
	if (entry) {
		entry.count++;
		return entry.count <= limit;
	}
	if (buckets.size >= 10000) return false;
	buckets.set(key, { count: 1, reset: now + windowMs });
	return true;
}
