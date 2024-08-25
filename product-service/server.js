const express = require("express");
const app = express();
const PORT = process.env.PORT || 6060;
const jwt = require("jsonwebtoken");
const authenticate = require("../authenticator.js");
const { Sequelize, Op } = require("sequelize");

// This is for the rabbit mq
const amqp = require("amqplib");

var channel, connection;

const { Product } = require("./model/product.model.js");

const connectDB = require("./db/index.js");

connectDB();

app.use(express.json());

const connect = async () => {
  const amqpServer = "amqp://localhost:5672";

  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();

  await channel.assertQueue("PRODUCT");
};

connect();

app.post("/product/create", authenticate, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    console.log(name, price, description);

    if (!name || !price) {
      return res.send("Some value are not existing");
    }

    const productExist = await Product.findOne({ where: { name, price } });

    if (productExist) {
      return res.send("Same Product Already Exists!");
    }

    const product = await Product.create({ name, price, description });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.send(`There was an error ${error}`);
  }
});

app.get("/product", authenticate, async (req, res) => {
  try {
    const product = await Product.findAll({});

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.send(`There was an error ${error}`);
  }
});

// user sends a list of products's id's to buy
// creating an order with those products and a total value of sum of product's prices

app.post("/product/buy", authenticate, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("Please provide a valid array of IDs.");
    }

    const products = await Product.findAll({
      where: {
        id: [...ids],
      },
    });

    if (!products) {
      return res.send("There were no product with the ids");
    }

    if (products) {
      let order;

      channel.sendToQueue(
        "ORDER",
        Buffer.from(
          JSON.stringify({
            products,
            userEmail: req.user.email,
            id: req.user.id,
          })
        )
      );

      channel.consume("PRODUCT", async (data) => {
        console.log("consuming order value");
        order = JSON.parse(data.content);
        console.log(order, "this is the order");
        return res.send({ message: "Order completed", order });
      });
    } else {
      channel.sendToQueue(
        "ORDER",
        Buffer.from(
          JSON.stringify({ products: [], userEmail: "test@gmail.com" })
        )
      );
    }
  } catch (error) {
   return res.send(`There was an error product controller buy ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Product Service at ${PORT}`);
});
