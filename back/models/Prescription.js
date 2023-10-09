const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js
const Patient = require('./Patient');
const Protocole = require('./Protocole');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_patient: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id',
    },
  },
  id_protocole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Protocoles',
      key: 'id_protocole',
    },
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
