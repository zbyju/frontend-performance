const express = require("express");
const {
  handleSolution,
  fetchSolutions,
  fetchSolutionsById,
  fetchUserSolutionsBySlug,
} = require("../services/solution");

const router = express.Router();

router.post("/", async (req, res) => {
  if (
    req.body.solution === undefined ||
    req.body.slug === undefined ||
    req.headers.authorization === undefined ||
    req.headers.authorization.length < 1
  ) {
    return res
      .status(400)
      .send("Missing data in request (solution, slug, user token)");
  }
  const solution = { ...req.body, token: req.headers.authorization };
  const handled = await handleSolution(solution);
  return res.status(200).json(handled);
});

router.get("/", async (req, res) => {
  const { rows } = await fetchSolutions();
  return res.status(200).json({ solutions: rows });
});

router.get("/:id", async (req, res) => {
  const { rows } = await fetchSolutionsById(req.params.id);
  if (rows.length === 0) return res.status(404).send("Not found");
  return res.status(200).json({ solutions: rows[0] });
});

router.get("/slug/:slug", async (req, res) => {
  if (req.headers.authorization === undefined)
    return res.status(400).send("No user");
  const { rows } = await fetchUserSolutionsBySlug(
    req.headers.authorization,
    req.params.slug
  );
  return res.status(200).json({ solutions: rows });
});

module.exports = router;
