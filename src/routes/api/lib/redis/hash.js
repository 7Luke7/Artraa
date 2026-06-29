"use server"
import { redis } from "../../redis";

export async function redisHSet(key, object) {
  try {
    return await redis.hSet(key, object);
  } catch (error) {
    console.log(error)
  }
}

export async function redisHModValue(key, field, value) {
  try {
    return await redis.hSet(key, field, value)
  } catch (error) {
    console.log(error)
  }
}

export async function redisHGetAll(key) {
  try {
    const hash = await redis.hGetAll(key);
    if (!Object.keys(hash).length) return null
    return hash
  } catch (error) {
    console.log(error)
  }
}

export async function redisHGet(key, field) {
  try {
    return await redis.hGet(key, field);
  } catch (error) {
    console.log(error)
  }
}