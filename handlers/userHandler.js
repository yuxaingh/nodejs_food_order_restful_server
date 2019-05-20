const dbFunction = require('../util/dbUtil').dbFunction;
const verifyPayloadType = require('../util/helper').verifyPayloadType;
const logger = require('../util/logger');

async function getAllUsers(){
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

async function postUser(request){
    if(!verifyPayloadType(request, 'user')){
        return {
            error: 'Bad request',
            statusCode: 400
        };
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
            return {
                error: 'This email has been registerd.',
                statusCode: 400
            }
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
        return {
            error: 'Bad request',
            statusCode: 400
        };
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
            let res = {
                error: "Can not find the user with id.",
                statusCode: 404
            };
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return res;
        }
        //Check if the email of the user want to change had already been taken
        [rows] = await dbFunction.getUserByEmail(email);
        if(rows[0].id != id){
            return {
                error: 'This email has been registerd. Please use another one.',
                statusCode: 400
            }
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