const redis = require("redis");
const { getRedisClient } = require("./connection");

const client = getRedisClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

const findInCache = (key) => {
  return client.get(key);
};

const saveInCache = (key, value) => {
  return client.set(key, value);
};

module.exports = {
  findInCache,
  saveInCache,
};
