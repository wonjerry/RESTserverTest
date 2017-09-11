var express = require('express');
var router = express.Router();

var clientManager = require('./clientManager.js');
var products = require('./products.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/checkExist', clientManager.checkExist);
router.post('/registerUser', clientManager.registerUser);
router.post('/login', clientManager.login);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', clientManager.getAllUserList);
router.get('/api/v1/admin/user/:email', clientManager.getOneUserData);
//router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:email', clientManager.updateUser);
router.delete('/api/v1/admin/user/:email', clientManager.deleteUser);

module.exports = router;