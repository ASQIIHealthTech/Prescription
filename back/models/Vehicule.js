const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you named your configuration file as db.js

const Vehicule = sequelize.define('Vehicule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  volume: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{
  tableName: 'Vehicule',
  timestamps: true
},
);

module.exports = Vehicule;
