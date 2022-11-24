const Redis = require("ioredis");

const redis = new Redis({
  host: "redis",
  port: 6379,
});

const findInCache = (slug, solution) => {
  return redis.get(slug + "|" + solution);
};

const saveInCache = (slug, solution, result) => {
  return redis.set(slug + "|" + solution, result);
};

module.exports = {
  findInCache,
  saveInCache,
};
