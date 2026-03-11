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

redisClient.on('error', (err) => console.error('Redis Error:', err));
redisClient.on('ready', () => console.log('Redis Ready & Authenticated!'));

redisClient.connect().catch(console.error);

export default redisClient;