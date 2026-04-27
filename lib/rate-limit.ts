/**
 * Small in-memory rate limiter. It is per server process, which is fine for a
 * single-instance deployment; use a shared store (e.g. Redis) when scaling out.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    const retryAfterSeconds = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return { ok: false as const, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true as const };
}

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
