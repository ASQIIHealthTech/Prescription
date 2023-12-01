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
    allowNull: true,
  },
  formule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jour_prod: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  voie: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type_perfusion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duree_perfusion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehicule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume_final: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commentaire: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Molecule;
