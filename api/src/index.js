const express = require("express");
const pg = require("pg");

const app = express();
const { Pool } = pg;

app.use(express.json());

const pool = new Pool();

app.get("/", (req, res) => {
  return res.status(200).send("Hello");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
