const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ParentProtocole = sequelize.define('ParentProtocole', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ParentProtocole;
