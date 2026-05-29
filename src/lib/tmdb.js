import redisClient from "@/lib/db/redis";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_KEY;

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  }

  let lastError;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, attempt * 300));
    }
  }

  throw lastError;
}

export async function getCachedOrFetch(key, fetchCallback, expiry = 86400) {
  try {
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);
  } catch {}

  const data = await fetchCallback();

  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch {}

  return data;
}

export { tmdbFetch };
