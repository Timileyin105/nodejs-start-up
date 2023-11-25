const express = require("express");
const Router = express.Router();
const Admin = require("../Controllers/admin");
const { sendErrorMsg } = require("../Utils");
const { adminAuthMiddleware } = require("../Middlewares/auth");

Router.post("/create", (req, res) => {
    Admin.create(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});


Router.post("/login", (req, res) => {
    Admin.login(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/verify-auth", adminAuthMiddleware, (req, res) => {
    Admin.verifyAuth(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});


Router.post("/update", adminAuthMiddleware, (req, res) => {
    Admin.update(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-update", adminAuthMiddleware, (req, res) => {
    Admin.update(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
    
});


Router.use("**", (req, res) => {
    res.status(404).json({ status: "failed", messsage: "404 not found" });
});

module.exports = Router;
