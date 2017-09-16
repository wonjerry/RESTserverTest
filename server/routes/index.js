var express = require('express');
var router = express.Router();

var clientManager = require('./clientManager.js');
var products = require('./products.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/Rellat/checkExist', clientManager.checkExist);
router.post('/Rellat/registerUser', clientManager.registerUser);
router.post('/Rellat/login', clientManager.login);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/Rellat/api/v1/products', products.getAll);
router.get('/Rellat/api/v1/product/:id', products.getOne);
router.post('/Rellat/api/v1/product/', products.create);
router.put('/Rellat/api/v1/product/:id', products.update);
router.delete('/Rellat/api/v1/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/Rellat/api/v1/admin/users', clientManager.getAllUserList);
router.get('/Rellat/api/v1/admin/user/:email', clientManager.getOneUserData);
router.put('/Rellat/api/v1/admin/user/:email', clientManager.updateUser);
router.delete('/Rellat/api/v1/admin/user/:email', clientManager.deleteUser);

module.exports = router;