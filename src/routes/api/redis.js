'use server'
import { BasicClientSideCache, createClient } from "redis";

const cache = new BasicClientSideCache({
  ttl: 60000,
  maxEntries: 1000,
  evictPolicy: "LRU",
});

export const redis = createClient({
  url: process.env.REDIS_URL,
  RESP: 3,
  clientSideCache: cache,
  socket: {
    reconnectStrategy: (retries, cause) => {
      if (cause.name === "SocketTimeoutError") {
        return false;
      }
      const jitter = Math.random() * 200;
      const delay = Math.min((2 ** retries) * 50, 2000);
      return delay + jitter;
    }
  }
});

redis.on("error", (err) => console.error(err));
await redis.connect();