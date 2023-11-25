
const User = require("../Models/User");
const Utils = require('../Utils');
const Settings = require("../Models/Settings");
const Transaction = require("../Models/Transaction");

const create = (request) => {

    return new Promise(async (resolve, reject) => {

        const { firstName, lastName, username, email, password, referral } = request;
        const userObj = { firstName, lastName, username, email, password };

        if (!Utils.validateField(userObj)) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }

        if(referral && referral != ""){
            userObj.referral = referral;
        }

        if (await fetchUser({ email })) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "User with this email already exist",
            });
        }

        if (await fetchUser({ username })) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "User with this username already exist",
            });
        }

        const settings = await Settings.findOne({ raw: true });
        const verificationCode = Utils.getRandom(100000, 900000);
        userObj.password = await Utils.becryptHash(userObj.password);
        userObj.verificationCode = verificationCode;
        userObj.promotionBalance = settings.signupCredit;

        User.create(userObj).then(async (userData) => {

            const token = Utils.signToken({ userId: userData.id }, process.env.JWT_SECRET_USER, '5d');
            await Utils.storeToken({ type: 'USER', id: userData.id, token });
            await Utils.sendMail('EMAIL_CONFIRMATION', email, { verificationCode });
          
            Utils.stripSensitive(userData);

            return resolve({
                status: "success",
                user: userData,
                token
            });

        }, err => {
            console.log(err);
            return reject({
                status: "failed",
                statusCode: 500,
                message: "Error Creating User Account"
            });
        });

    })
}



const fetchUser = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({ where: { ...data }, raw: true }).then(user => {
            resolve(user);
        }, err => {
           resolve(null)
        });
    })
}

const fetchUsers = (request) => {
    return new Promise((resolve, reject) => {
        User.findAll({ raw: true }).then(users => {
            users = users.map(user => { Utils.stripSensitive(user); return user });
            resolve({
                status: "success",
                users
            });
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}

const fetchUserSingle = (request) => {
    return new Promise((resolve, reject) => {
        User.findOne({where: {id: request.id}, raw: true }).then(user => {
            Utils.stripSensitive(user);
            resolve({
                status: "success",
                user
            });
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}


const update = (request) => {

    return new Promise((resolve, reject) => {

        const { firstName, lastName } = request;
        const userObj = { firstName, lastName };

        if (!request._userId || request._userId == "") {
            return reject({
                status: "auth_failed",
                statusCode: 403,
                message: "unauthenticated",
            });
        }

        User.update(userObj, { where: { id: request._userId } }).then(async (userData) => {

            const token = Utils.signToken({ userId: request._userId }, process.env.JWT_SECRET_USER, '5d');
            await Utils.storeToken({ type: 'USER', id: request._userId, token });

            return resolve({
                status: "success",
                token
            });
        })

    });
}

const adminUpdate = (request) => {

    return new Promise(async (resolve, reject) => {

        const  { firstName, lastName, email, id, status} = request;
        const userObj =  { firstName, lastName, email, status};

        if (!Utils.validateField(userObj)) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }
        // userObj.password = password = await Utils.becryptHash(userObj.password);
        User.update(userObj, { where: { id } }).then(async (userData) => {
            const token = Utils.signToken({ userId: id }, process.env.JWT_SECRET_USER, '5d');
            await Utils.storeToken({ type: 'USER', id, token });
            return resolve({
                status: "success"
            });
        });

    });
}

const adminBalanceAction = (request) => {

    return new Promise(async (resolve, reject) => {

        const { amount, type, remark , id} = request;
        const balanceActionObj = { amount, type, remark , id};

        if (!Utils.validateField(balanceActionObj)) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }

        const user = await fetchUser({id});
        if(!user){
             return reject({
                status: "failed",
                statusCode: 404,
                message: "User not found"
            });
        }

        let newBalance = user.balance;
        type === "+" ? newBalance+= parseInt(amount) : newBalance-=parseInt(amount);

        await Transaction.create({   
            userId: id,
            chargeType: type === '+' ? 'credit' : 'debit', 
            remark, amount,
            transactionCharge: 0, status: 'completed'
        });

        await User.update({balance: newBalance}, { where: { id } });

        const token = Utils.signToken({ userId: id }, process.env.JWT_SECRET_USER, '5d');
        await Utils.storeToken({ type: 'USER', id, token });

        return resolve({
            status: "success"
        });

    });
}

const verifyAuth = ({ _userId : userId, _user: user }) => {

    return new Promise(async (resolve, reject) => {
        const token = Utils.signToken({ userId }, process.env.JWT_SECRET_USER, '5d');
        await Utils.storeToken({ type: 'USER', id: userId, token });
        Utils.stripSensitive(user);
        resolve({
            status: "success",
            token, user
        });
    });
}

const login = (request) => {

    return new Promise(async (resolve, reject) => {

        const email = request.email;
        const password = request.password;

        if (!Utils.validateField({ email, password })) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }

        const userObj = await fetchUser({ email });

        if (!userObj) {
            return reject({
                status: "failed",
                statusCode: 401,
                message: "Incorrect email or password"
            })
        }

        if (!Utils.bcryptCompare(password, userObj.password)) {
            return reject({
                status: "failed",
                statusCode: 401,
                message: "Incorrect email or password"
            })
        }

        if (userObj.status == "disabled") {
            return resolve({
                status: "failed",
                statusCode: 403,
                message: "Account is disabled: kinldy contact Administrator"
            })
        }

        const status = userObj.status === "active" ? "success" : "pending_email_verification";

        const token = Utils.signToken({ userId: userObj.id }, process.env.JWT_SECRET_USER, '5d');
        await Utils.storeToken({ type: 'USER', id: userObj.id, token });

        Utils.stripSensitive(userObj);

        return resolve({
            status,
            user: userObj,
            token
        });

    })
}



const verifyEmail = (request) => {

    return new Promise(async (resolve, reject) => {

        const id = request._userId;
        const verificationCode = request.verificationCode;

        if (!Utils.validateField({ verificationCode })) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }

        const userObj = await fetchUser({ id });

        if (!userObj) {
            return reject({
                status: "failed",
                statusCode: 404,
                message: "User not found"
            })
        }

        if (userObj.status == "disabled") {
            return resolve({
                status: "failed",
                statusCode: 403,
                message: "Account is disabled: kinldy contact Administrator"
            })
        }

        if (userObj.verificationCode === verificationCode) {

            if (userObj.referral && userObj.referral != "") {

                fetchUser({ username: userObj.referral }).then(async (referralUser) => {

                    const settings = await Settings.findOne({ raw: true });
                    const referralBonusAmount = settings.referral_bonus;

                    const promotionBalance = referralUser.promotionBalance + referralBonusAmount;
                    await User.update({ promotionBalance }, { where: { id: referralUser.id } });

                    await Transaction.create({
                        userId: referralUser.id,
                        username: referralUser.username,
                        chargeType: 'credit', remark: 'referral bonus',
                        amount: referralBonusAmount,
                        transactionCharge: 0, status: 'completed'
                    });

                }, err => { });

            }

            await User.update({ status: 'active' }, { where: { id } });

            return resolve({
                status: "success",
                statusCode: 200
            });

        } else {

            return resolve({
                status: "failed",
                statusCode: 200,
                message: "Incorrect verification code"
            });

        }
    })
}




module.exports = {
    create,
    login,
    update,
    verifyAuth,
    adminUpdate,
    fetchUsers,
    verifyEmail,
    fetchUserSingle,
    adminBalanceAction
}