"use server"
import { redis } from "../../redis";
import { logError } from "../../lib/log"

export async function redisHSet(key, object) {
  try {
    return await redis.hSet(key, object);
  } catch (error) {
    logError("lib/redis/hash", error)
  }
}

export async function redisHModValue(key, field, value) {
  try {
    return await redis.hSet(key, field, value)
  } catch (error) {
    logError("lib/redis/hash", error)
  }
}

export async function redisHGetAll(key) {
  try {
    const hash = await redis.hGetAll(key);
    if (!Object.keys(hash).length) return null
    return hash
  } catch (error) {
    logError("lib/redis/hash", error)
  }
}

export async function redisHGet(key, field) {
  try {
    return await redis.hGet(key, field);
  } catch (error) {
    logError("lib/redis/hash", error)
  }
}