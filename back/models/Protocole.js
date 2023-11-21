const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Protocole = sequelize.define('Protocole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_protocole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  protocole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  intercure: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nb_cures: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  indications: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type_histo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Protocole;
