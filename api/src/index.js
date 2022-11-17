const express = require("express");
const pg = require("pg");
const cors = require("cors");

const app = express();
const { Pool } = pg;

app.use(express.json());
app.use(cors());

const pool = new Pool();

app.get("/", (req, res) => {
  return res.status(200).send("Hello");
});

app.listen(4000, () => {
  console.log(`App listening on port 4000`);
});

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
