import amqplib, { Connection } from 'amqplib';

const queue = 'email';

let connection: Connection | undefined;
let channel: any;

const connect = async () => {
  try {
    if (!connection) {
      connection = await amqplib.connect(process.env.RABBITMQ_URL!);
    }
    channel = await connection.createChannel();
  } catch (error) {
    throw new Error('Could not connect to RabbitMQ');
  }
};

const sendToQueue = async ({ recipientEmail, purpose, username }: { recipientEmail: string; purpose: string; username: string }) => {
  await connect();
  channel.assertQueue(queue, { durable: true });
  await channel.sendToQueue(queue, Buffer.from(JSON.stringify({ recipientEmail, purpose, username })), { persistent: true });
};

export { sendToQueue };
