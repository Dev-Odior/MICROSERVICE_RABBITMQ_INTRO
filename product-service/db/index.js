const Sequelize = require("sequelize");

const { init, Product } = require("../model/product.model");

const connectDB = async () => {
  const connection = new Sequelize(
    "microservice_product",
    "root",
    "1234567890",
    {
      host: "localhost",
      dialect: "mysql",
    }
  );

  init(connection);

  await connection.sync({ alter: true });

  console.log("Database connected successfully");
};

module.exports = connectDB;
