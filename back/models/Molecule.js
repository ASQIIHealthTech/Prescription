const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Molecule = sequelize.define('Molecule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_protocole: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  molecule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jour_prod: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Molecule;
