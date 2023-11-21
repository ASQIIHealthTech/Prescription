const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_cure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_molecule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  validation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0
  },
  adjusted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0
  }
});

module.exports = Product;
