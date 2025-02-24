import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
