const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;
const store = new Map();

export function rateLimit(handler) {
  return async (req, res) => {
    const key = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";
    const now = Date.now();
    const entry = store.get(key) || { count: 0, expires: now + WINDOW_MS };

    if (now > entry.expires) {
      entry.count = 0;
      entry.expires = now + WINDOW_MS;
    }

    entry.count += 1;
    store.set(key, entry);

    if (entry.count > MAX_REQUESTS) {
      res.status(429).json({ message: "Too many requests" });
      return;
    }

    return handler(req, res);
  };
}
