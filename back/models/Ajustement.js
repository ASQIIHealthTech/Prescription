const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Ajustement = sequelize.define('Ajustement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dillution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume_dillution: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  cond_final: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume_solvant: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  volume_final: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  volumePA: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = Ajustement;
