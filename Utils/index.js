
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Admin = require("../Models/Admin");

/**
 * @function
 * handles request error message
 * @param {any} param.res (request response)
 * @param {any} param.err (request error)
 * @return {any} returns express json response
*/

const sendErrorMsg = (res, err) => {

    let message = "Server Error Kindly Try Again Later";
    message = err.message ? err.message : message;

    let statusCode = 504;
    statusCode = err.statusCode ? err.statusCode : 504;

    let status = "failed";
    status = err.status ? err.status : status;

    res.status(statusCode).json({ status, message });
};


/**
 * generate a hash becrypt string
 * @param {string} param.string
 * @returns {Promise<string>} returns becrypt hashed string
 */
const becryptHash = (str) => {
    return new Promise(async (resolve, reject) => {
        try {
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    reject({ status: "failed", statusCode: 500, message: err.message });
                }
                bcrypt.hash(String(str), salt, function (err, hash) {
                    if (err) {
                        reject({ status: "failed", statusCode: 500, message: err.message });
                    }
                    resolve(hash);
                });
            });
        } catch (error) {
            reject({ status: "failed", statusCode: 500, message: error.message });
        }
    });
};

/**
 * compare becrypt hash string and raw string
 * @param {string} param.raw_string
 * @param {string} param.becrypt_hashed_string
 * @returns {boolean}
 */

const bcryptCompare = (str1, str2) => {
    return bcrypt.compareSync(str1, str2);
};


/**
 * validaate a json object from empty fields
 * @param {Promise.reject} param.Promise.reject
 * @param {Object} param.Object
 * @returns {boolean}
 */


const validateField = (field) => {
    let fieldValidated = true;
    for (let i in field) {
        if (!field[i] || field[i] == "") {
            fieldValidated = false;
        }
    }

    if (!fieldValidated) {
       fieldValidated = false;
    }

    return fieldValidated;
};


const getRandom = (min, max) => {

    Math.floor(Math.random() * max) + min;
}

/**
 * send email to an email address
 * @param {string} param.template 'EMAIL_CONFIRMATION' || ...
 * @param {string} param.email
 * @param {string} param.data
 * @returns {Promise<boolean>}
 */


const sendMail = (template, email, data) => {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

/**
 * store a signed jwt token in database
 * @param {string} param.type 'USER' || 'ADMIN
 * @param {string} param.id
 * @returns {Promise} 
 */

const storeToken = ({type, id, token})=> {
    return new Promise((resolve, reject) => {
        const dbModel = type  === 'ADMIN' ? Admin : User;
        dbModel.update({token}, {where: {id}}).then( result => {
            resolve(result);
        }, err => {
            reject(err);
        })
    })
}


/**
 * signed a jwt token
 * @param {Object} param.tokenData {}
 * @param {string} param.token_secret
 * @param {string} param.token_lifetime (1y, 2y, 5y)
 * @return {string} signedToken
 */

const signToken = (tokenData, secret, lifetime) => {
    const token = jwt.sign({ ...tokenData }, secret, {
        expiresIn: lifetime
    });

    return token;
};

/**
 * fetch a user / admin object
 * @param {string} param.type 'USER' || 'ADMIN
 * @param {Object} param.data
 * @returns {Promise} 
 */

const fetchUser = (type, data) => {

    return new Promise(resolve => {

        const dbModel = type  === 'ADMIN' ? Admin : User;
        dbModel.findOne({ where: {...data}, raw: true }).then(user => {
            resolve(user);
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}

/**
 * verify a signed token
 * @param {string} param.token
 * @param {string} param.token_secret
 * @returns {Object} 
 */
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, async function (err, tokenData) {
            if (err) {
                console.log(err);
                reject({ status: "failed", statusCode: 504 });
            }

            resolve(tokenData);
        });
    });
};

/**
 * parse cryptocurrencies object fields
 * @param {Array} param.cryptocurrencies
 * @param {string} param.address
 * @returns {array}
 */


module.exports = {
    sendErrorMsg,
    validateField,
    signToken,
    verifyToken,
    becryptHash,
    bcryptCompare,
    sendMail,
    getRandom,
    storeToken,
    fetchUser
};
