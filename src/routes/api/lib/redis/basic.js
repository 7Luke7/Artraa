'use server'
import { redis } from "../../redis";

export async function redisSet(key, value, ttlSeconds) {
    try {
        if (ttlSeconds) {
            return await redis.set(key, value, { EX: ttlSeconds });
        }
        return await redis.set(key, value);    
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function redisGet(key) {
  try {
    return await redis.get(key);    
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function redisDel(key) {
    try {
        return await redis.del(key);
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function redisExists(key) {
  try {
    return await redis.exists(key);        
  } catch (error) {
    return null
  }
}
