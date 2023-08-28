  
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    username: process.env.DB_NAME,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = sequelize;;
