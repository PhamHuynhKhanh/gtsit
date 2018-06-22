var router = require('express').Router();
var authController = require('./../controller/auth.controller');
var userController = require('./../controller/user.controller');
var auth = require('../middle-ware/auth');

module.exports = function () {
    router.post('/login', authController.login);
    router.get('/getuserbytoken', auth.auth(), authController.getUserByToken)
    return router;
}