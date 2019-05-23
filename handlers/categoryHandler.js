const dbFunction = require('../util/dbUtil').dbFunction;
const {verifyPayloadType, verifyHeaderAuth} = require('../util/helper');
const logger = require('../util/logger');
const constants = require('../util/constants');

async function getAllCategories(request){
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let res;
    try{
        let [rows] = await dbFunction.getAllCategory();
        res = {
            type: 'category',
            data: rows
        };
        return res;
    }catch(err){
        throw err;
    }
}

async function postCategory(request){
    if(!verifyPayloadType(request, 'category')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let name = request.body.data.name;
    try{
        let executeResult = await dbFunction.createCategory(name);
        let insertId = executeResult[0].insertId;
        logger.info(`Successfully created category with id: ${insertId}`);
        request.body.data.id = insertId;
        logger.info(`POST /category response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

async function patchCategory(request){
    if(!verifyPayloadType(request, 'category')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let id = request.params.id;
    let name = request.body.data.name;
    try{
        let [rows] = await dbFunction.getCategoryById(id);
        if(rows.length === 0){;
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return constants.DATA_NOT_FOUND_RESPONSE;
        }
        await dbFunction.updateCategoryById(id, name);
        logger.info(`Successfully update category with id: ${id}`);
        logger.info(`PATCH /category response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}
exports.getAllCategories = getAllCategories;
exports.postCategory = postCategory;
exports.patchCategory = patchCategory;