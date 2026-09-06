"use server"
import { redis } from "../../redis";
import { logError } from "../../lib/log"

export async function redisSet(key, value, ttlSeconds) {
  try {
    return await redis.set(key, value, { EX: ttlSeconds });
  } catch (error) {
    logError("lib/redis/basic", error)
  }
}

export async function redisGet(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    logError("lib/redis/basic", error)
  }
}

export async function redisDel(key) {
  try {
    return await redis.del(key);
  } catch (error) {
    logError("lib/redis/basic", error)
  }
}

export async function redisExists(key) {
  try {
    return await redis.exists(key);
  } catch (error) {
    logError("lib/redis/basic", error)
  }
}

/**
 * Seconds left on a key, or null when it has none.
 *
 * Redis answers -2 for "no such key" and -1 for "key exists but never
 * expires"; both are folded to null so a caller can treat "no deadline to
 * show" as one case instead of remembering the sentinel values.
 */
export async function redisTtl(key) {
  try {
    const seconds = await redis.ttl(key);
    return seconds >= 0 ? seconds : null;
  } catch (error) {
    logError("lib/redis/basic", error)
  }
}
