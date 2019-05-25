const jwt = require('jsonwebtoken');
const jwtconfig = require('../config').jwtconfig;

//Todo: implement more validator logic for different payload
function verifyPayloadType(request, type){
    return request.body.type === type;
}

//If isAdmin is set to true, this function will check if the user is admin
function verifyHeaderAuth(request, isAdmin){
    if(!(request.headers.authorization)){
        return false;
    }
    let token = request.headers.authorization.split(' ')[1];
    try {
        let decoded = jwt.verify(token, jwtconfig.SECRET_KEY);
        if(isAdmin && decoded.isAdmin != true){
            return false;
        }
        return true;
      } catch(err) {
          return false;
      }
}

function decodeJWT(request){
    let token = request.headers.authorization.split(' ')[1];
    return jwt.verify(token, jwtconfig.SECRET_KEY);
}

function generateJWT(obj){
    let token = jwt.sign(obj, jwtconfig.SECRET_KEY, {expiresIn: jwtconfig.EXPIRY_DAY});
    return token;
}

exports.generateJWT = generateJWT;
exports.verifyHeaderAuth = verifyHeaderAuth;
exports.verifyPayloadType = verifyPayloadType;
exports.decodeJWT = decodeJWT;