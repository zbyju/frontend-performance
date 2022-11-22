const pg = require("pg");
let mainPool = null;

function createPool() {
  const pool = new pg.Pool();
  return pool;
}

function getPool() {
  if (!mainPool) {
    mainPool = createPool();
  }
  return mainPool;
}

module.exports = { getPool };
