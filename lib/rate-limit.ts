const memory = new Map();

export function rateLimit(userId: string, limit: number) {
  const now = Date.now();
  const window = 1000 * 60 * 60; // 1 hour

  const entry = memory.get(userId) || { count: 0, start: now };

  if (now - entry.start > window) {
    memory.set(userId, { count: 1, start: now });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  memory.set(userId, entry);

  return true;
}
