const dbFunction = require('../util/dbUtil').dbFunction;
const {verifyPayloadType, generateJWT} = require('../util/helper');
const logger = require('../util/logger');
const constants = require('../util/constants');

async function getJWT(request){
    if(!verifyPayloadType(request, 'login')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    
    let email = request.body.data.email;
    let password = request.body.data.password;
    let [rows] = await dbFunction.getUserByEmail(email);
    if(rows.length > 0){
        if(rows[0].password === password){
            let obj = {
                id: rows[0].id,
                user: rows[0].name,
                email: rows[0].email,
                isAdmin: rows[0].isAdmin
            };
            logger.info(`${rows[0].name} successful login, isAdmin: ${rows[0].isAdmin}`);
            return {
                type: "login",
                data: {
                    jwt: generateJWT(obj)
                }
            };
        }
    }

    return constants.LOGIN_ERROR_RESPONSE;
}

exports.getJWT = getJWT;