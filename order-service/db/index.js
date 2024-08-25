const Sequelize = require("sequelize");

const { init, Order } = require("../model/order.model");

const connectDB = async () => {
  const connection = new Sequelize("microservice_order", "root", "1234567890", {
    host: "localhost",
    dialect: "mysql",
  });

  init(connection);

  await connection.sync({ force: true });

  console.log("Order Database connected successfully");
};

module.exports = connectDB;
