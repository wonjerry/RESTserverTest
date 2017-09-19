var express = require('express')
var router = express.Router()

/*
 * Routes that can be accessed by any one
 */
var clientManager = require('./clientManager.js')
router.post('/user/checkExist', clientManager.checkExist)
router.post('/user/registerUser', clientManager.registerUser)
router.post('/user/login', clientManager.login)

/*
 * Routes that can be accessed only by autheticated users
 */
var products = require('./products.js')
router.get('/api/v1/products', products.getAll)
router.get('/api/v1/product/:id', products.getOne)
router.post('/api/v1/product/', products.create)
router.put('/api/v1/product/:id', products.update)
router.delete('/api/v1/product/:id', products.delete)

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/admin/users', clientManager.getAllUserList)
router.get('/api/v1/admin/user/:email', clientManager.getOneUserData)
router.put('/api/v1/admin/user/:email', clientManager.updateUser)
router.delete('/api/v1/admin/user/:email', clientManager.deleteUser)

module.exports = router
