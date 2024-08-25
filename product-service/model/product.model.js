const { Model, DataTypes } = require("sequelize");

class Product extends Model {}

const init = (sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, timestamps: true }
  );
};

const associations = () => {};

module.exports = { Product, init, associations };
