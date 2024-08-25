const express = require("express");
const app = express();
const PORT = process.env.PORT || 7070;
const authenticate = require("../authenticator.js");

// This is for the rabbit mq
const amqp = require("amqplib");

let channel, connection;

const { Order } = require("./model/order.model.js");

const connectDB = require("./db/index.js");

connectDB();

app.use(express.json());

const connect = async () => {
  const amqpServer = "amqp://localhost:5672";

  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();

  await channel.assertQueue("ORDER");
};

const createNewOrder = async (products, id) => {
  try {
    let total = 0;

    for (let t = 0; t < products.length; ++t) {
      total += products[t].price;
    }

    const order = await Order.create({
      products,
      user: id,
      total_price: total,
    });

    if (order) {
      console.log(`Order created successfully`);
    } else {
      console.log("Failed to create order");
    }

    return order;
  } catch (error) {
    console.log(`There was an error at create new order: ${error}`);
  }
};

connect().then(() => {
  channel.consume("ORDER", async (data) => {
    const { products, id } = JSON.parse(data.content);

    const order = await createNewOrder(products, id);

    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ order })));
  });
});

// user sends a list of products's id's to buy
// creating an order with those products and a total value of sum of product's prices

app.get("/order", authenticate, async (req, res) => {
  const orders = await Order.findAll({});

  return res.status(200).json({ message: "All orders fetched", orders });
});

app.listen(PORT, () => {
  console.log(`Product Service at ${PORT}`);
});
