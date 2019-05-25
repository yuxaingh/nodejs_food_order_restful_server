var express = require('express');
var router = express.Router();
const logger = require('../util/logger');
const {getAllCompanies, postCompany, patchCompany, getCompanyById} = require('../handlers/companyHandler');
const {getAllCategories, postCategory, patchCategory} = require('../handlers/categoryHandler');
const {getAllItems, postItem, patchItem} = require('../handlers/itemHandler');
const {getAllUsers, postUser, patchUser} = require('../handlers/userHandler');
const {getJWT} = require('../handlers/loginHandler');
const {getAllOrders, getOrderById, postOrder} = require('../handlers/orderHandler');

function sendErrorResponse(res, error, errorCode){
  switch(errorCode){
    case 400:
      res.status(400).send(error);
      break;
    case 401:
      res.status(401).send(error);
      break;
    case 404:
      res.status(404).send(error);
      break;
    case 500:
      res.status(500).send(error);
      logger.error(JSON.stringify(error.stack));
      break;
  }
}

function sendResponse(res, body, type){
  if(body.statusCode){
    sendErrorResponse(res, body, body.statusCode);
  }else{
    switch(type){
      case 'GET':
        res.send(body);
        break;
      case 'POST':
      case 'PATCH':
        res.status(201).send(body);
        break;
      case 'DELETE':
        res.status(204).send();
        break;
    }
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FOS'});
});

router.get('/company', function(req, res, next){
  getAllCompanies(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/company/:id', function(req, res, next){
  getCompanyById(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.post('/company', function(req, res, next){
  postCompany(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.patch('/company/:id', function(req, res, next){
  patchCompany(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'PATCH');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/category', function(req, res, next){
  getAllCategories(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.post('/category', function(req, res, next){
  postCategory(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.patch('/category/:id', function(req, res, next){
  patchCategory(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'PATCH');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/item', function(req, res, next){
  getAllItems(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.post('/item', function(req, res, next){
  postItem(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.patch('/item/:id', function(req, res, next){
  patchItem(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'PATCH');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/user', function(req, res, next){
  getAllUsers(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.post('/user', function(req, res, next){
  postUser(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.patch('/user/:id', function(req, res, next){
  patchUser(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'PATCH');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.post('/login', function(req, res, next){
  getJWT(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/order', function(req, res, next){
  getAllOrders(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  });
});

router.get('/order/:id', function(req, res, next){
  getOrderById(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'GET');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.post('/order', function(req, res, next){
  postOrder(req)
  .then(responseBody => {
    sendResponse(res, responseBody, 'POST');
  })
  .catch(err => {
    sendErrorResponse(res, err, 500);
  })
});

router.all('/*', function(req, res, next){
  logger.info(`404 Can not ${req.method} - ${req.originalUrl}`);
  sendErrorResponse(res, {error: "Does not have this api."}, 404);
});

module.exports = router;
