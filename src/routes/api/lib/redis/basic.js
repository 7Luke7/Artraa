import { redis } from "../../redis";

export async function redisSet(key, value, ttlSeconds) {
  try {
    return await redis.set(key, value, { EX: ttlSeconds });
  } catch (error) {
    throw error
  }
}

export async function redisGet(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    throw error
  }
}

export async function redisDel(key) {
  try {
    return await redis.del(key);
  } catch (error) {
    throw error
  }
}

export async function redisExists(key) {
  try {
    return await redis.exists(key);
  } catch (error) {
    throw error
  }
}
