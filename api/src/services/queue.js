const amqp = require("amqplib/callback_api");

let channel, connection;

const forGradingQueue = "for_grading";

async function connect() {
  amqp.connect(
    process.env.CLOUDAMQP_URL || "amqp://localhost:5672",
    function (error0, conn) {
      if (error0) {
        return console.log(error0);
      }
      connection = conn;
      connection.createChannel(function (error1, ch) {
        if (error1) {
          return console.log(error1);
        }

        channel = ch;

        channel.assertQueue(forGradingQueue, {
          durable: false,
        });
      });
    }
  );
  return connection && channel ? true : false;
}

function sendForGrading(msg) {
  console.log(msg);
}

module.exports = {
  connect,
  sendForGrading,
};
