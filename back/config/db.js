  
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     username: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DATABASE,
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// });

// const sequelize = new Sequelize({
//     username: 'root',
//     password: 'asqiiaminpasswordDB',
//     database: 'prescription',
//     host: 'database',
//     port: 3306,
//     dialect: 'mysql'
// });

const sequelize = new Sequelize({
    username: 'root',
    password: 'asqiiaminpasswordDB',
    database: process.env.DB_DATABASE || 'prescription',
    host: 'database',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
});

module.exports = sequelize;