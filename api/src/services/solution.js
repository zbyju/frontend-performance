const { getPool } = require("./pool");
const { sendForGrading } = require("./queue");

async function handleSolution(solution) {
  const { rows } = await saveSolutionPending({ ...solution });
  if (!rows || rows.length < 1) return undefined;
  sendForGrading(rows[0].id, rows[0].slug, rows[0].solution);
  return rows[0];
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
