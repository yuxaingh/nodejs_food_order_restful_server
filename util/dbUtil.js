const mysql = require('mysql2');
const dbconfig = require('../config').dbconfig;

// create the pool
const pool = mysql.createPool({
    host: dbconfig.DB_HOST,
    user: dbconfig.DB_USER,
    password: dbconfig.DB_PASSWORD,
    database: dbconfig.DB_NAME,
    waitForConnections: dbconfig.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: dbconfig.DB_CONNECTION_LIMIT,
    queueLimit: dbconfig.DB_QUEUE_LIMIT
  });
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();
// query database using promises

const dbFunction = {};


//DB util functions for company
dbFunction.getAllCompanies = function(){
    return promisePool.query('SELECT * FROM `company`');
}

dbFunction.getCompanyById = function(id){
    return promisePool.query('SELECT * FROM `company` WHERE id=?', [id]);
}

dbFunction.createCompany = function(name, email, phone){
    let date = new Date();
    return promisePool.execute('INSERT INTO `company` (name, email, phone, createdDate) VALUE (?, ?, ?, ?)',
    [name, email, phone, date]);
}

dbFunction.updateCompanyById = function(id, name, email, phone){
    return promisePool.execute('UPDATE `company` SET name=?, email=?, phone=? WHERE id=?', [name, email, phone, id]);
}

//DB util function for category
dbFunction.getAllCategory = function(){
    return promisePool.query('SELECT * FROM `category`');
}

dbFunction.getCategoryById = function(id){
    return promisePool.query('SELECT * FROM `category` WHERE id=?', [id]);
}

dbFunction.createCategory = function(name){
    return promisePool.execute('INSERT INTO `category` (name) VALUE (?)', [name]);
}

dbFunction.updateCategoryById = function(id, name){
    return promisePool.execute('UPDATE `category` SET name=? WHERE id=?', [name, id]);
}

//DB util function for item
dbFunction.getAllItems = function(){
    return promisePool.query('SELECT * FROM `item`');
}

dbFunction.getItemById = function(id){
    return promisePool.query('SELECT * FROM `item` WHERE id=?', [id]);
}

dbFunction.createItem = function(name, price, desc, categoryId, companyId){
    return promisePool.execute('INSERT INTO `item` (name, price, description, category, company) VALUE (?, ?, ?, ?, ?)', 
    [name, price, desc, categoryId, companyId]);
}

dbFunction.updateItemById = function(id, name, price, desc, categoryId, companyId){
    return promisePool.execute('UPDATE `item` SET name=?, price=?, description=?, category=?, company=? WHERE id=?', 
    [name, price, desc, categoryId, companyId, id]);
}

dbFunction.getAllUsers = function(){
    return promisePool.query('SELECT id, name, email, phone, address, isAdmin FROM `user`');
}

dbFunction.getUserById = function(id){
    return promisePool.query('SELECT id, name, email, phone, address, isAdmin FROM `user` WHERE id=?', [id]);
}

dbFunction.getUserByEmail = function(email){
    return promisePool.query('SELECT id, name, email, phone, address, isAdmin, password FROM `user` WHERE email=?', [email]);
}

dbFunction.createUser = function(name, email, phone, address, isAdmin, password){
    return promisePool.execute('INSERT INTO `user` (name, email, phone, address, isAdmin, password) VALUE (?, ?, ?, ?, ?, ?)', 
    [name, email, phone, address, isAdmin, password]);
}

dbFunction.updateUserById = function(id, name, email, phone, address, isAdmin, password){
    return promisePool.execute('UPDATE `user` SET name=?, email=?, phone=?, address=?, isAdmin=?, password=? WHERE id=?', 
    [name, email, phone, address, isAdmin, password, id]);
}

dbFunction.getAllOrders = function(){
    return promisePool.execute('SELECT * FROM `order_detail` JOIN `item` ON order_detail.item_id=item.id JOIN `order` ON order.id=order_detail.order_id');
}

dbFunction.getOrderById = function(id){
    return promisePool.execute('SELECT * FROM `order_detail` JOIN `item` ON order_detail.item_id=item.id JOIN `order` ON order.id=order_detail.order_id WHERE order_detail.order_id=?',
    [id]);
}

dbFunction.getOrdersByUserId = function(id){
    return promisePool.execute('SELECT * FROM `order_detail` JOIN `item` ON order_detail.item_id=item.id JOIN `order` ON order.id=order_detail.order_id WHERE order.user=?',
    [id]);
}

dbFunction.createOrder = function(itemList, userid, date){
    let orderid;
    return promisePool.execute('INSERT INTO `order` (user, createdDate) VALUE (?,?)', [userid, date])
    .then((executeResult)=>{
        orderid = executeResult[0].insertId;
        let promiseArray = [];
        for(let i=0; i<itemList.length; i++){
            promiseArray.push(promisePool.execute('INSERT INTO `order_detail` (item_id, quantity, order_id) VALUE (?,?,?)',
            [itemList[i].id, itemList[i].quantity, orderid]));
        }
        return Promise.all(promiseArray);
    })
    .then(()=>{
        return orderid;
    });
}

exports.dbFunction = dbFunction;