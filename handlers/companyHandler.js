const dbFunction = require('../util/dbUtil').dbFunction;
const verifyPayloadType = require('../util/helper').verifyPayloadType;
const logger = require('../util/logger');

async function getAllCompanies(){
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
    let id = request.params.id;
    try{
        let [rows] = await dbFunction.getCompanyById(id);
        if(rows.length === 0){
            let res = {
                error: "Can not find the company with id.",
                statusCode: 404
            };
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return res;
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
        return {
            error: 'Bad request',
            statusCode: 400
        };
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
        return {
            error: 'Bad request',
            statusCode: 400
        };
    }
    let id = request.params.id;
    let name = request.body.data.name;
    let email = request.body.data.email;
    let phone = request.body.data.phone;
    try{
        let [rows] = await dbFunction.getCompanyById(id);
        if(rows.length === 0){
            let res = {
                error: "Can not find the company with id.",
                statusCode: 404
            };
            logger.error(`404 Data not found for ${request.method} - ${request.originalUrl}`);
            return res;
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