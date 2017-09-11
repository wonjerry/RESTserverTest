var jwt = require('jwt-simple');
var User = require('./../models/User');

var auth = {
    checkExist : function (req, res) {
        var username = req.body.email || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username + " password : " + password
            });
            return;
        }

        User.findOne({email:username}, function(error,user){

            if(error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "username : " + username + " password : " + password
                });
                return;
            }

            if(!user){
                res.json({
                    "status": 'false',
                    "message": 'user is not exist'
                });
            }else if(user.email === username){
                res.json({
                    "status": 'true',
                    "message": 'user already exist'
                });
            }
        });
    },

    registerUser : function (req, res) {
        var username = req.body.email || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username + " password : " + password
            });
            return;
        }

        var newUser = new User({ email: username, password: password, userRole: 'admin'});

        newUser.save(function (error, data) {
            if (error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": 'oopse unknown error In registerUser'
                });
            }
            else{
                res.json({
                    "status": 'true',
                    "message": 'successfully registered'
                });
            }
        });
    },

    login : function (req, res) {
        var username = req.body.email || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username + " password : " + password
            });
            return;
        }

        User.findOne({email:username}, function(error,user) {

            if (error) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "username : " + username + " password : " + password
                });
                return;
            }

            if(!user){
                res.json({
                    "status": 'false',
                    "message": "user dosen't exist"
                });

            }else if (user.email == username && user.password == password) {
                res.json({
                    "status": 'true',
                    "message": 'validate user',
                    "token": genToken(user)
                });
            } else {
                res.json({
                    "status": 'false',
                    "message": 'non-validate user'
                });
            }

        });

    },

    getAllUserList : function (req, res) {
        var result = [];
        User.find({},function(error, users){

            if(error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": 'error in AllUserList'
                });
            }else{
                res.json({
                    "status": 'true',
                    "message": 'find all users!',
                    "userData": users
                });
            }
        });
    },

    getOneUserData : function (req, res) {
        var username = req.params.email || '';

        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username
            });
            return;
        }

        User.findOne({email:username}, function(error,user) {
            if(error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": 'error in getOneUserData'
                });
            }else if(user){
                res.json({
                    "status": 'true',
                    "message": 'find user!',
                    "userData": user
                });
            } else {
                res.json({
                    "status": 'false',
                    "message": 'user doesnt exist'
                });
            }
        });
    },

    updateUser : function (req, res) {
        var newData = req.body;
        var username = req.params.email;

        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username
            });
            return;
        }

        User.findOne({email:username}, function(error,user) {
            if(error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": 'error in updateUser'
                });
            }else if(user){
                user.email = newData.email;
                user.password = newData.password;
                user.userRole = newData.userRole;
                user.save(function(error,updatedUser){
                    if(error){
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": 'error in updateUser/save'
                        });
                    }else{
                        res.json({
                            "status": 'true',
                            "message": 'update user!',
                            "userData": updatedUser
                        });
                    }
                });
            } else {
                res.json({
                    "status": 'false',
                    "message": 'user doesnt exist'
                });
            }
        });
    },

    deleteUser : function (req, res) {
        var username = req.params.email;

        if (username == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "username : " + username
            });
            return;
        }

        User.remove({email:username}, function(error,user) {
            if(error){
                res.status(401);
                res.json({
                    "status": 401,
                    "message": 'error in getOneUserData'
                });
            }else {
                res.json({
                    "status": 'true',
                    "message": 'user deleted'
                });
            }
        });
    }


};

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
