import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        connectTimeout: 10000
    }
});

redisClient.on('error', (err) => console.error('Upstash Error:', err));
redisClient.on('ready', () => console.log('Upstash Redis Ready!'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Could not connect to Upstash:", err);
    }
})();

export default redisClient;