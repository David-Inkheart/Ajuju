import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string)
    }
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err: Error) => {
    console.log(`Something went wrong ${err}`);
});

(async () => {
    await redisClient.connect();
})();

export default redisClient;
