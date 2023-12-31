
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: 'mariadb',
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },
});

module.exports =  db;