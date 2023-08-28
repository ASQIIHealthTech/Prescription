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
    allowNull: false,
  },
  civil: {
    type: DataTypes.STRING,
    allowNull: false,
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
  DDN: {
    type: DataTypes.INTEGER,
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
    allowNull: false,
  },
  creatinine: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  formuleClair: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clairance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
});

module.exports = Patient;
