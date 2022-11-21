const amqp = require("amqplib/callback_api");

let missedSolutions = [];
let channel,
  connection = undefined;

const forGradingQueue = "for_grading";

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
              missedSolutions.forEach((m) => sendForGrading(m));
              missedSolutions = [];
              resolve(true);
            }
          );
        });
      }
    );
  });
}

function sendForGrading(msg) {
  if (channel) {
    channel.sendToQueue(forGradingQueue, Buffer.from(msg));
    console.log("Added to queue: ", msg);
  } else {
    missedSolutions.push(msg);
  }
}

module.exports = {
  connect,
  sendForGrading,
};
