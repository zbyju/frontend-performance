const exec = require("await-exec");
const fs = require("fs/promises");
const { getPool } = require("./connection");

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

module.exports = {
  createGradingContainer,
  runGradingContainer,
  updateResult,
};
