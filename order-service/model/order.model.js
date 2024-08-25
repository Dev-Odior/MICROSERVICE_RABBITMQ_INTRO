const { Model, DataTypes } = require("sequelize");

class Order extends Model {}

const init = (sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      user: {
        type: DataTypes.INTEGER,
      },
      total_price: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, timestamps: true }
  );
};

const associations = () => {};

module.exports = { Order, init, associations };
