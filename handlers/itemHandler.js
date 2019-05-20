const dbFunction = require('../util/dbUtil').dbFunction;
const verifyPayloadType = require('../util/helper').verifyPayloadType;
const logger = require('../util/logger');

async function getAllItems(){
    let res;
    try{
        let [rows] = await dbFunction.getAllItems();
        res = {
            type: 'item',
            data: rows
        };
        return res;
    }catch(err){
        throw err;
    }
}

async function postItem(request){
    if(!verifyPayloadType(request, 'item')){
        return {
            error: 'Bad request',
            statusCode: 400
        };
    }
    let categoryId = request.body.data.category;
    let companyId = request.body.data.company;
    let name = request.body.data.name;
    let price = request.body.data.price;
    let description = null;
    if(request.body.data.description){
        description = request.body.data.description;
    }
    try{
        let executeResult = await dbFunction.createItem(name, price, description, categoryId, companyId);
        let insertId = executeResult[0].insertId;
        logger.info(`Successfully created item with id: ${insertId}`);
        request.body.data.id = insertId;
        logger.info(`POST /item response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

async function patchItem(request){
    if(!verifyPayloadType(request, 'item')){
        return {
            error: 'Bad request',
            statusCode: 400
        };
    }
    let id = request.params.id;
    let categoryId = request.body.data.category;
    let companyId = request.body.data.company;
    let name = request.body.data.name;
    let price = request.body.data.price;
    let description = null;
    if(request.body.data.description){
        description = request.body.data.description;
    }
    try{
        let [rows] = await dbFunction.getItemById(id);
        if(rows.length === 0){
            let res = {
                error: "Can not find the item with id.",
                statusCode: 404
            };
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return res;
        }
        await dbFunction.updateItemById(id, name, price, description, categoryId, companyId);
        logger.info(`Successfully update item with id: ${id}`);
        logger.info(`PATCH /item response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}
exports.getAllItems = getAllItems;
exports.postItem = postItem;
exports.patchItem = patchItem;