'use server'
/**
 * Redis client.
 *
 * Accepts either a single REDIS_URL (what the containerised stacks use) or the
 * host/port/password triple. Authentication is only configured when a password
 * is actually present: sending AUTH to a Redis without ACLs - which is how the
 * local test instance runs - is refused outright.
 */
import { createClient } from "redis";

const options = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10)
      },
      ...(process.env.REDIS_PASSWORD
        ? { username: process.env.REDIS_USERNAME || "default", password: process.env.REDIS_PASSWORD }
        : {})
    }

export const redis = createClient(options)

redis.on("error", (err) => console.error("Redis error:", err));

redis.connect().catch((err) => console.error("Redis connection failed:", err));
