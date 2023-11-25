
const Admin = require("../Models/Admin");
const Utils = require('../Utils');



const fetchAdmin = (data) => {

    return new Promise(resolve => {
        Admin.findOne({ where: { ...data }, raw: true }).then(admin => {
            resolve(admin);
        }, err => {
            reject({
                status: "Server Error: Kindly try again",
                statusCode: 500
            })
        });
    })
}

const update = (admin) => {

    return new Promise((resolve, reject) => {

        const adminObj = {firstName, lastName, email} = admin;

        if(admin.password && admin.password != ""){
            adminObj.password = Utils.becryptHash(admin.password);
        }

        if(!admin.admin_id || admin.admin_id == ""){
            return reject({
                status: "auth_failed",
                statusCode: 401,
                message: "unauthenticated",
            });
        } 
        
        Admin.update(adminObj, {where: {id: admin.admin_id}}).then(async (adminData) => { 
        
            const token = Utils.signToken({ admin_id: admin.admin_id }, process.env.JWT_SECRET_ADMIN, '5d');
            await Utils.storeToken({type: 'ADMIN', id: admin.admin_id, token});

            return resolve({
                status: "success",
                token
            });
        })
        
    });
}

const verifyAuth = ({admin_id}) => {

    return new Promise(async (resolve, reject) => {
        const token = Utils.signToken({ admin_id }, process.env.JWT_SECRET_ADMIN, '5d');
        await Utils.storeToken({type: 'ADMIN', id: admin_id, token});
        
        resolve({
            status: "success",
            token
        });
    });
}

const login = (admin) => {
    
    return new Promise(async (resolve, reject) => {

         const  { email, password } = admin;

        if (!Utils.validateField({ email, password })) {
            return reject({
                status: "failed",
                statusCode: 400,
                message: "BAD REQUEST : INCOMPLETE PAYLOAD",
            });
        }

        const adminObj =  await fetchAdmin({email});

        if(!adminObj){
            return reject({
                status: "failed",
                statusCode: 401,
                message: "Incorrect email or password"
            })
        }

        if(!Utils.bcryptCompare(password, adminObj.password)){
            return reject({
                status: "failed",
                statusCode: 401,
                message: "Incorrect email or password"
            })
        }

        if(adminObj.status == "disabled"){
            return resolve({
                status: "failed",
                statusCode: 200,
                message: "Account is disabled: kinldy contact Super Administrator"
            })
        }

        const status = adminObj.status === "active" ? "success" : "pending_email_verification";

        const token = Utils.signToken({ admin_id: adminObj.id }, process.env.JWT_SECRET_ADMIN, '5d');
        await Utils.storeToken({type: 'ADMIN', id: adminObj.id, token});
        delete adminObj.token;
        delete adminObj.id;
        delete adminObj.password;

        return resolve({
            status,
            admin: adminObj,
            token
        });        

    })
}




module.exports = {
    // create,
    login,
    update,
    verifyAuth
}