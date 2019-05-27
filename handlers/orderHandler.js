const dbFunction = require('../util/dbUtil').dbFunction;
const {verifyPayloadType, verifyHeaderAuth, decodeJWT} = require('../util/helper');
const logger = require('../util/logger');
const constants = require('../util/constants');
const mqsend = require('../util/helper').mqsend;

//Case 1(no query string):
//If the caller is admin, return all users's order;
//If the caller is not admin, return all orders of that user

//Case 2(has query string 'user=?'):
//If the caller is admin, return all the orders of the user
//If the caller is not admin, ignore the query string and return all orders of that user
async function getAllOrders(request){
    if(!verifyHeaderAuth(request, false)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let isAdmin = false;
    if(verifyHeaderAuth(request, true)){
        isAdmin = true;
    }
    let user = null;
    if(isAdmin && request.query.user){
        user = request.query.user;
    }else if(!isAdmin){
        user = decodeJWT(request).id;
    }
    let res = {
        type: 'order'
    };
    try{
        let rows;
        if(user){
            [rows] = await dbFunction.getOrdersByUserId(user);
        }else{
            [rows] = await dbFunction.getAllOrders();
        }
        res.data = rows;
        return res;
    }catch(err){
        throw err;
    }
}

//If the caller is admin, return that order is the order id is valid
//If the caller is not admin, check if the order is under that user
async function getOrderById(request){
    if(!verifyHeaderAuth(request, false)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let isAdmin = false;
    if(verifyHeaderAuth(request, true)){
        isAdmin = true;
    }
    let id = request.params.id;
    let res = {
        type: "order"
    };
    try{
        let [rows] = await dbFunction.getOrderById(id);
        if(rows.length == 0){
            return constants.DATA_NOT_FOUND_RESPONSE;
        }
        if(!isAdmin && rows[0].user != decodeJWT(request).id){
            return constants.DATA_NOT_FOUND_RESPONSE;
        }else{
            res.data = rows;
            return res;
        }
    }catch(err){
        throw err;
    }
}

async function postOrder(request){
    if(!verifyPayloadType(request, 'order')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, false)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let userid = decodeJWT(request).id;
    let companyid = request.body.data.company;
    let date = new Date();
    let queue = 'company' + companyid;
    try{
        let insertId = await dbFunction.createOrder(request.body.data.itemList, userid, companyid, date);
        logger.info(`Successfully created order with id: ${insertId}`);
        request.body.data.id = insertId;
        //prepare order json to send to message queue server
        let [rows] = await dbFunction.getOrderById(insertId);
        let msg = {
            type: "order",
            data: {
                itemList: rows
            }
        };
        //send order message to rabbitmq server
        await mqsend(queue, JSON.stringify(msg));
        logger.info(`POST /order response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

exports.getAllOrders = getAllOrders;
exports.getOrderById = getOrderById;
exports.postOrder = postOrder;