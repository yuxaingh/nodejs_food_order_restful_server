const dbFunction = require('../util/dbUtil').dbFunction;
const {verifyPayloadType, verifyHeaderAuth} = require('../util/helper');
const logger = require('../util/logger');
const constants = require('../util/constants');

async function getAllUsers(request){
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE
    };
    let res;
    try{
        let [rows] = await dbFunction.getAllUsers();
        res = {
            type: 'user',
            data: rows
        };
        return res;
    }catch(err){
        throw err;
    }
}

//Todo: only administrator can create admin user
async function postUser(request){
    if(!verifyPayloadType(request, 'user')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let name = request.body.data.name;
    let email = request.body.data.email;
    let phone = null;
    let address = null;
    let isAdmin = request.body.data.isAdmin;
    let password = request.body.data.password;
    if(request.body.data.phone){
        phone = request.body.data.phone;
    }
    if(request.body.data.address){
        phone = request.body.data.address;
    }
    try{
        //Check if db already had the same email
        let [rows] = await dbFunction.getUserByEmail(email);
        if(rows.length > 0){
            return constants.INVALID_EMAIL_RESPONSE;
        }
        //If the email is valid, continue registeration
        let executeResult = await dbFunction.createUser(name, email, phone, address, isAdmin, password);
        let insertId = executeResult[0].insertId;
        logger.info(`Successfully created user with id: ${insertId}`);
        request.body.data.id = insertId;
        logger.info(`POST /user response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

async function patchUser(request){
    if(!verifyPayloadType(request, 'user')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let id = request.params.id;
    let name = request.body.data.name;
    let email = request.body.data.email;
    let phone = null;
    let address = null;
    let isAdmin = request.body.data.isAdmin;
    let password = request.body.data.password;
    if(request.body.data.phone){
        phone = request.body.data.phone;
    }
    if(request.body.data.address){
        address = request.body.data.address;
    }
    try{
        let [rows] = await dbFunction.getUserById(id);
        if(rows.length === 0){
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return constants.DATA_NOT_FOUND_RESPONSE;
        }
        //Check if the email of the user want to change had already been taken
        [rows] = await dbFunction.getUserByEmail(email);
        if(rows[0].id != id){
            return constants.INVALID_EMAIL_RESPONSE;
        }

        //If the email is valid, continue update user info
        await dbFunction.updateUserById(id, name, email, phone, address, isAdmin, password);
        logger.info(`Successfully update user with id: ${id}`);
        logger.info(`PATCH /user response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}
exports.getAllUsers = getAllUsers;
exports.postUser = postUser;
exports.patchUser = patchUser;