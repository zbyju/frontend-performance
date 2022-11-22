const amqp = require("amqplib/callback_api");

let missedSolutions = [];
let channel,
  connection = undefined;

const forGradingQueue = "for_grading";
const gradedQueue = "graded";

async function connect() {
  return new Promise((resolve, reject) => {
    amqp.connect(
      process.env.CLOUDAMQP_URL || "amqp://localhost:5672",
      function (error0, conn) {
        if (error0) {
          console.log(error0);
          return reject(false);
        }
        connection = conn;
        connection.createChannel(function (error1, ch) {
          if (error1) {
            console.log(error1);
            return reject(false);
          }

          // Create queue for grading
          channel = ch;
          channel.assertQueue(
            forGradingQueue,
            {
              durable: false,
            },
            (error2) => {
              if (error2) {
                console.log(error2);
                return reject(false);
              }
              missedSolutions.forEach(({ id, solution }) =>
                sendForGrading(id, solution)
              );
              missedSolutions = [];
              resolve(true);
            }
          );
        });
      }
    );
  });
}

function sendForGrading(id, solution) {
  if (channel) {
    channel.sendToQueue(forGradingQueue, Buffer.from(`${id}|${solution}`));
    console.log("Added to queue: ", id, solution);
  } else {
    missedSolutions.push({ id, solution });
  }
}

module.exports = {
  connect,
  sendForGrading,
};
