const express = require("express");
const Router = express.Router();
const User = require("../Controllers/user");
const { sendErrorMsg } = require("../Utils");
const { userAuthMiddleware, adminAuthMiddleware, unverifiedAuthMiddleware } = require("../Middlewares/auth");

Router.post("/register", (req, res) => {
    User.create(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/login", (req, res) => {
    User.login(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/verify-auth", userAuthMiddleware, (req, res) => {
    User.verifyAuth(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/verify-email", unverifiedAuthMiddleware, (req, res) => {
    User.verifyEmail(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/update", userAuthMiddleware, (req, res) => {
    User.update(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-update", adminAuthMiddleware, (req, res) => {
    User.adminUpdate(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-fetch", adminAuthMiddleware, (req, res) => {
    User.fetchUsers(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-fetch-single", adminAuthMiddleware, (req, res) => {
    User.fetchUserSingle(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.post("/admin-balance-action", adminAuthMiddleware, (req, res) => {
    User.adminBalanceAction(req.body).then((resp) => {
        res.json(resp);
    }, err => {
        sendErrorMsg(res, err);
    });
});

Router.use("**", (req, res) => {
    res.status(404).json({ status: "failed", messsage: "404 not found" });
});

module.exports = Router;
