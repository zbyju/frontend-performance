const amqp = require("amqplib/callback_api");
const {
  createGradingContainer,
  runGradingContainer,
  updateResult,
} = require("./grade");

function connect() {
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
}

async function handleGrading(msg) {
  const [id, solution] = msg.split("|");

  const randomKey = Math.floor(Math.random() * 900000000 + 100000000);

  const graderContainerName = await createGradingContainer(solution, randomKey);
  const result = await runGradingContainer(graderContainerName, randomKey);
  updateResult(id, result);
  return result;
}

module.exports = {
  connect,
};
