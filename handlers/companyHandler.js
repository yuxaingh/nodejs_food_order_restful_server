const dbFunction = require('../util/dbUtil').dbFunction;
const {verifyPayloadType, verifyHeaderAuth} = require('../util/helper');
const logger = require('../util/logger');
const constants = require('../util/constants');

async function getAllCompanies(request){
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let res = {
        type: 'company'
    };
    try{
        const [rows] = await dbFunction.getAllCompanies();
        res.data = [...rows];
        return res;
    }catch(err){
        throw err;
    }
}

async function getCompanyById(request){
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let id = request.params.id;
    try{
        let [rows] = await dbFunction.getCompanyById(id);
        if(rows.length === 0){
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return constants.DATA_NOT_FOUND_RESPONSE;
        }
        let res = {
            type: "company",
            data: rows[0]
        };
        return res;
    }catch(err){
        throw err;
    }
}

async function postCompany(request){
    if(!verifyPayloadType(request, 'company')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let name = request.body.data.name;
    let email = request.body.data.email;
    let phone = request.body.data.phone;
    try{
        let executeResult = await dbFunction.createCompany(name, email, phone);
        let insertId = executeResult[0].insertId;
        logger.info(`Successfully created company with id: ${insertId}`);
        request.body.data.id = insertId;
        logger.info(`POST /company response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

async function patchCompany(request){
    if(!verifyPayloadType(request, 'company')){
        return constants.BAD_REQUEST_RESPONSE;
    }
    if(!verifyHeaderAuth(request, true)){
        return constants.AUTHORIZATION_ERROR_RESPONSE;
    }
    let id = request.params.id;
    let name = request.body.data.name;
    let email = request.body.data.email;
    let phone = request.body.data.phone;
    try{
        let [rows] = await dbFunction.getCompanyById(id);
        if(rows.length === 0){
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return constants.DATA_NOT_FOUND_RESPONSE;
        }
        await dbFunction.updateCompanyById(id, name, email, phone);
        logger.info(`Successfully update company with id: ${id}`);
        logger.info(`PATCH /company response: ${JSON.stringify(request.body)}`);
        return request.body;
    }catch(err){
        throw err;
    }
}

exports.getAllCompanies = getAllCompanies;
exports.postCompany = postCompany;
exports.patchCompany = patchCompany;
exports.getCompanyById = getCompanyById;