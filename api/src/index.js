const express = require("express");
const cors = require("cors");
const { connect } = require("./services/queue");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/solution", require("./controllers/solution"));

const intervalQueue = setInterval(async () => {
  const res = await connect();
  console.log("Success connecting to the queue: ", res);
  if (res) clearInterval(intervalQueue);
}, 5000);

app.listen(4000, () => {
  console.log(`App listening on port 4000`);
});

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
