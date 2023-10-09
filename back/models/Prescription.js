const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_patient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_protocole: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prescripteur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nbrCures: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  essaiClin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  commentaire:{
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = Prescription;
