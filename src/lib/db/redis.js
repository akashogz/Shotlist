import { createClient } from "redis";

let redisClient;

if (!global._redisClient) {
  global._redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      connectTimeout: 10000,
    },
  });

  global._redisClient.on("error", (err) =>
    console.error("Redis Error:", err)
  );

  global._redisClient.connect().catch(console.error);
}

redisClient = global._redisClient;

export default redisClient;
