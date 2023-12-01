const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Flacon = sequelize.define('Flacon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prepId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dosage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  volume: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
});

module.exports = Flacon;
