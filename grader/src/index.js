const amqp = require("amqplib/callback_api");
const exec = require("await-exec");
const fs = require("fs/promises");
const { getPool } = require("./services/pool");

const forGradingQueue = "for_grading";

amqp.connect(
  process.env.CLOUDAMQP_URL || "amqp://localhost:5672",
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(forGradingQueue, {
        durable: false,
      });

      channel.consume(
        forGradingQueue,
        (msg) => handleGrading(msg.content.toString()),
        {
          noAck: true,
        }
      );
    });
  }
);

async function handleGrading(msg) {
  const [id, solution] = msg.split("|");

  const randomKey = Math.floor(Math.random() * 900000000 + 100000000);

  const graderContainerName = await createGradingContainer(solution, randomKey);
  const result = await runGradingContainer(graderContainerName, randomKey);
  updateResult(id, result);
  return result;
}

const createGradingContainer = async (code, randomKey) => {
  const randomFileName = `submission-${randomKey}.data`;
  await fs.writeFile(randomFileName, code);

  const graderContainerName = `submission-image-${randomKey}`;
  const tmpGraderContainerName = `${graderContainerName}-tmp`;

  await exec(`docker create --name ${tmpGraderContainerName} grader-image`);

  await exec(
    `docker cp ${randomFileName} ${tmpGraderContainerName}:/app/submission/submitted_code.data`
  );

  await exec(`docker commit ${tmpGraderContainerName} ${graderContainerName}`);

  await exec(`docker rm -fv ${tmpGraderContainerName}`);

  await fs.rm(randomFileName);

  return graderContainerName;
};

const runGradingContainer = async (graderContainerName, randomKey) => {
  await exec(
    `docker run --name ${graderContainerName}-image ${graderContainerName}`
  );

  await exec(
    `docker cp ${graderContainerName}-image:/app/submission/result.data result-${randomKey}.data`
  );

  await exec(`docker image rm -f ${graderContainerName}`);

  await exec(`docker rm -fv ${graderContainerName}-image`);

  const result = await fs.readFile(`result-${randomKey}.data`, "utf-8");
  await fs.rm(`result-${randomKey}.data`);

  return result.toString().trim();
};

const updateResult = (id, result) => {
  const pool = getPool();
  let res = result;
  if (["PASS", "PASSED", "TRUE"].includes(result)) res = "PASSED";
  else res = "FAILED";
  return pool.query(`UPDATE solutions SET result = '${res}' WHERE id = ${id};`);
};
