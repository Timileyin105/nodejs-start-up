const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('admins', {
    id: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.ENUM('super_admin', 'admin'),
        allowNull: false,
        default: 'admin'
    },
    status: {
        type: DataTypes.ENUM('active', 'disabled'),
        defaultValue: 'active',
        allowNull: false,
    },
    totalDeposits: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    totalDepositsAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    totalUsers: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    totalActiveUsers: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    totalInactiveUsers: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    token:{
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    verificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: DataTypes.DATE
},
    {
        freezeTableName: true,
        timestamps: true,
        hooks: {
            afterCreate: (record) => {
                delete record.dataValues.token;
                delete record.dataValues.password;
                delete record.dataValues.createdAt;
                delete record.dataValues.updatedAt;
                delete record.dataValues.verificationCode;
            },
            afterUpdate: (record) => {
                delete record.dataValues.token;
                delete record.dataValues.password;
                delete record.dataValues.createdAt;
                delete record.dataValues.updatedAt;
                delete record.dataValues.verificationCode;
            },
        }
    }
);

// db.sync({ alter: true}).then((result) => {
//     console.log('users db sync successful');
// }).catch((err) => {
//     console.log('users db sync failed');
// });