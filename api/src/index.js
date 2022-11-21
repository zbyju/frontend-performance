const express = require("express");
const cors = require("cors");
const { connect } = require("./services/queue");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/solution", require("./controllers/solution"));

const connectToQueue = async () => {
  let res = false;
  try {
    await connect();
    res = true;
  } catch (err) {
    res = false;
  }
  if (!res) {
    const intervalQueue = setInterval(async () => {
      try {
        await connect();
        res = true;
      } catch (err) {
        res = false;
      }
      if (res) clearInterval(intervalQueue);
    }, 5000);
  }
  console.log("Successfully connected to RabbitMQ");
};
connectToQueue();

app.listen(4000, () => {
  console.log(`App listening on port 4000`);
});

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
