const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  DMI: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matrimonial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  poids: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  taille: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  surfCorp: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  creatinine: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  formuleClair: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clairance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
});

module.exports = Patient;
