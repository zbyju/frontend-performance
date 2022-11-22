const amqp = require("amqplib/callback_api");

const forGradingQueue = "for_grading";
const gradedQueue = "graded";

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

function handleGrading(msg) {
  console.log(msg.split("|"));
}
