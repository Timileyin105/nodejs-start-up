const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('users', {
    id: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    status: {
        type: DataTypes.ENUM('active', 'disabled', 'unverified'),
        defaultValue: 'unverified',
        allowNull: false,
    },
    mode: {
        type: DataTypes.ENUM('live', 'demo'),
        defaultValue: 'demo',
        allowNull: false
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    promotionBalance: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalDepositsCount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
    },
    totalDepositsAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    token:{
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    referral: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    verificationCode: {
        type: DataTypes.NUMBER,
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