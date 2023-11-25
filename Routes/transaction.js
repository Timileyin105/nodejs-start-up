const express = require("express");
const Router = express.Router();
const Transaction = require("../Controllers/transaction");
const { sendErrorMsg } = require("../Utils");
const { userAuthMiddleware, adminAuthMiddleware } = require("../Middlewares/auth");

Router.post("/fetch", userAuthMiddleware,  (req, res) => {
    Transaction.fetchTransactions(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-fetch-single", adminAuthMiddleware,  (req, res) => {
    Transaction.adminFetchTransactionSingle(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-fetch", adminAuthMiddleware,  (req, res) => {
    Transaction.adminFetchTransactions(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});


Router.use("**", (req, res) => {
    res.status(404).json({ status: "failed", messsage: "404 not found" });
});

module.exports = Router;
