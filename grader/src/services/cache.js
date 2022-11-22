const Redis = require("ioredis");

const redis = new Redis({
  host: "redis",
  port: 6379,
});

const findInCache = (key) => {
  return redis.get(key);
};

const saveInCache = (key, value) => {
  return redis.set(key, value);
};

module.exports = {
  findInCache,
  saveInCache,
};
