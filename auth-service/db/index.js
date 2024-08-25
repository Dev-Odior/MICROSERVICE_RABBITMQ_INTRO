const Sequelize = require("sequelize");

const { init, User } = require("../model/user.model");

const connectDB = async () => {
  const connection = new Sequelize("microservice_user", "root", "1234567890", {
    host: "localhost",
    dialect: "mysql",
  });

  init(connection);

  await connection.sync({ force: true });

  console.log("User Database connected successfully");
};

module.exports = connectDB;
