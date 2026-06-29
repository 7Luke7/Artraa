'use sevrer'
import { createClient } from "redis";

export const redis = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    }
})  

redis.on("error", (err) => console.error(err));
redis.connect();