const { getPool } = require("./pool");

async function handleSolution(solution) {
  const { rows } = await saveSolutionPending({ ...solution });
  return rows[0] || undefined;
}

function gradeSolution(solution) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      const rng = Math.random();
      const res = rng > 0.5 ? true : false;
      resolve(res);
    }, 10000);
  });
}

function saveSolutionPending(solution) {
  const pool = getPool();
  return pool.query(
    `INSERT INTO solutions(slug, token, solution, result) VALUES('${solution.slug}', '${solution.token}', '${solution.solution}', 'PENDING') RETURNING *`
  );
}

function updateSolutionResult(id, result) {
  const pool = getPool();
  return pool.query(
    `UPDATE solutions SET result = '${result}' WHERE id = ${id};`
  );
}

function fetchSolutions() {
  const pool = getPool();
  return pool.query("SELECT * from solutions;");
}

function fetchSolutionsById(id) {
  const pool = getPool();
  return pool.query(`SELECT * from solutions WHERE id=${id};`);
}

function fetchUserSolutionsBySlug(userId, slug) {
  const pool = getPool();
  return pool.query(
    `SELECT * from solutions WHERE token='${userId}' AND slug='${slug}' ORDER BY "created_at" DESC;`
  );
}

module.exports = {
  handleSolution,
  fetchSolutions,
  fetchSolutionsById,
  fetchUserSolutionsBySlug,
};
