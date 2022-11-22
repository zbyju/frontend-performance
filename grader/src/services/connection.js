const pg = require("pg");
const redis = require("redis");

let mainPool = null;
let redisClient = null;

function createPool() {
  const pool = new pg.Pool();
  return pool;
}

function createRedisClient() {
  const redisClient = redis.createClient();
  return redisClient;
}

function getPool() {
  if (!mainPool) {
    mainPool = createPool();
  }
  return mainPool;
}

function getRedisClient() {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
}

module.exports = { getPool, getRedisClient };
