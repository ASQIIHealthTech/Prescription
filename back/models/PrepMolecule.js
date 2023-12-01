const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const PrepMolecule = sequelize.define('PrepMolecule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dci: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unite_dosage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  unite_volume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pretA: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  solvant_reconstitution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume_reconstitution: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  unite_volume_reconstitution  : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conservation_reconstitution_frigo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehicule: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  volume_dilution: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unite_volume_dilution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  concentration_min: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  concentration_max: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  unite_concentration  : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  conservation_dilution_frigo  : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  délai_conservation_dilution  : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  abri_lumière  : {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = PrepMolecule;
