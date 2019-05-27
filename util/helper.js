const jwt = require('jsonwebtoken');
const jwtconfig = require('../config').jwtconfig;
const amqp = require('amqplib');
const mqconfig = require('../config').mqconfig;
const logger = require('../util/logger');

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

//helper function for sending message to message queue server
function mqsend(queue, msg){
    return amqp.connect(mqconfig.MQ_HOST)
    .then((conn) => {
        //because the function sendToQueue is not a promise and it does not have callback, we need to delay the connection close a little
        // bit to avoid closing the connection before it actually send out the message. This is not a good solution may need further 
        //improvement.
        setTimeout(function(){
            conn.close();
        }, 500);
        return conn.createChannel()
        .then((ch) => {
            //Declaring a queue is idempotent - it will only be created if it doesn't exist already. (From rabbitmq tutorial)
            return ch.assertQueue(queue, {durable: false})
            .then(() => {
                return ch.sendToQueue(queue, Buffer.from(msg));
            })
        })
        .then(() => {
            logger.info(`Successfully send order message to queue ${queue} with json: ${JSON.stringify(msg)}`);
        });
    })
    .catch(err => {
        throw err;
    })
}

exports.mqsend = mqsend;
exports.generateJWT = generateJWT;
exports.verifyHeaderAuth = verifyHeaderAuth;
exports.verifyPayloadType = verifyPayloadType;
exports.decodeJWT = decodeJWT;