const { DataTypes } = require('sequelize');
const db = require('../config/db');

module.exports = db.define('transactions', {
    id: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    userId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    chargeType: {
        type: DataTypes.ENUM('credit', 'debit'),
        allowNull: false
    },
    remark:{
        type: DataTypes.ENUM('deposit', 'withdrawal', 'referral bonus'),
        allowNull: false
    },
    amount: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    transactionCharge: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'active',
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: DataTypes.DATE
},
    {
        freezeTableName: true,
        timestamps: true
    }
);

// db.sync({ alter: true}).then((result) => {
//     console.log('transaction db sync successful');
// }).catch((err) => {
//     console.log('users db sync failed');
// });