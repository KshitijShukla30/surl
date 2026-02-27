import { Redis } from "@upstash/redis";

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
    globalForRedis.redis ||
    new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || "https://dummy-url",
        token: process.env.UPSTASH_REDIS_REST_TOKEN || "dummy-token",
    });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
