 
const Transaction = require("../Models/Transaction");
const Utils = require('../Utils');

const adminFetchTransactions = (request) => {

    return new Promise((resolve, reject) => {

        const whereQuery = {};
        if(request.userId && request.userId != "") whereQuery.userId = request.userId; 

        Transaction.findAll({where: whereQuery, raw: true }).then(transactions => {
            resolve({
                status: "success",
                transactions
            });
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}

const adminFetchTransactionSingle = (request) => {

    return new Promise((resolve, reject) => {
        const id = request.transactionId;
        Transaction.findOne({ where: { id }, raw: true }).then(transaction => {
            resolve({
                status: "success",
                transaction
            });
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}


const fetchTransactions = (request) => {
    return new Promise((resolve, reject) => {
        const userId = request._userId;
        Transaction.findAll({ where: { userId }, raw: true }).then(transactions => {
            resolve({
                status: "success",
                transactions
            });
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}

module.exports = {
    adminFetchTransactions,
    adminFetchTransactionSingle,
    fetchTransactions
}
