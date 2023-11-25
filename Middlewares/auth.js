
const Utils = require('../Utils');

const userAuthMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ status: "auth_failed", message: "Unautheticated" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated",
        });
    }

    try {

        const userObj = await Utils.verifyToken(token, process.env.JWT_SECRET_USER);
        if (userObj) {

            const user = await Utils.fetchUser('USER', { token });

            if (user) {

                if (user.status === "active") {
                    req.body._userId = user.id;
                    req.body._user = user;
                    return next();
                } else {
                    return res.status(401).json({
                        status: "auth_failed",
                        message: "Unauthorized",
                    });
                }
            }

        }

        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated",
        });

    } catch (error) {
        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated",
        });
    }
}


const adminAuthMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ status: "auth_failed", message: "Unautheticated" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated3",
        });
    }

    try {

        const adminObj = await Utils.verifyToken(token, process.env.JWT_SECRET_ADMIN);
        if (adminObj) {
            const admin = await Utils.fetchUser('ADMIN', { token });
            if (admin) {
                if (admin.status === "active") {
                    req.body._adminId = admin.id;
                    req.body._username = "Administrator";
                    return next();
                } else {
                    return res.status(401).json({
                        status: "auth_failed",
                        message: "Unauthorized",
                    });
                }
            }
        }

        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated2",
        });

    } catch (error) {
        return res.status(401).json({
            status: "auth_failed",
            message: "Unautheticated1",
        });
    }
}

module.exports = {
    userAuthMiddleware,
    adminAuthMiddleware
}