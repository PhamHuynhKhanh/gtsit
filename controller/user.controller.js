var userService = require('./../service/user.service');
var message = require('./../utils/message');
var fs = require('fs');
var path = require('path');
module.exports = {
    createUser: createUser,
    getAllUser: getAllUser,
    getUserById: getUserById,
    updateUser: updateUser,
    deleteUser: deleteUser,
    uploadAvatar: uploadAvatar,
    getUserByEmail: getUserByEmail,
    searchUserArray: searchUserArray,
    checkUserMakedFriend: checkUserMakedFriend
}
function checkUserMakedFriend(req, res){
    var idother = req.params.idother;
    var idme = req.params.idme;
    userService.checkUserMakedFriend(idother, idme).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err);
    })
}

function searchUserArray(req, res) {
    var textSearch = { 
        textSearch: req.body.keySearch,
        id: req.body.id 
    };
    userService.searchUserArray(textSearch).then(result => {
        var response = {
            result: result 
        }
        res.send(response);
    }).catch(err => {
        var response = {
            err: err 
        }
        res.send(response);
    });
}

function getUserByEmail(req, res) {
    var email = req.params.email;
    userService.getUserByEmail(email)
        .then(function (response) {
            res.send(response);
        })
        .catch(function (err) {
            res.send(err);
        });
};

function uploadAvatar(req, res) {
    var id = req.params.id;//ID User is Logining
    var base64Data = req.body.image.replace(/^data:(image|application|text)\/(x-icon|png|jpeg|json|plain|pdf);base64,/, "");//Cut Part Don't Need
    var typeImg = req.body.name;//Name Real Image
    var type = typeImg.substring(typeImg.indexOf("."));// type of your Profit

    var request = {
        id: req.params.id,
        base64Data: base64Data,
        typeImg: typeImg,
        type: type,
    }

    userService.uploadFile(request).then((response) => {
        res.send({ url: response });
    })
        .catch((err) => {
            res.send(err);
        });
}
function deleteUser(req, res) {
    var request = {
        id: req.params.id
    }
    userService.deleteUser(request).then(function (response) {
        res.send(response)
    }).catch(function (err) {
        res.send(err)
    });
}

function updateUser(req, res) {
    var request = {
        id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        companyschool: req.body.companyschool,
        sex: req.body.sex,
        age: req.body.age,
        favorite: req.body.favorite,
        job: req.body.job,
        slogan: req.body.slogan
    };


    userService.updateUser(request).then(function (response) {
        res.send(response);
    }).catch(function (err) {
        res.send(err)
    });
}
function getUserById(req, res) {
    var id = req.params.id;
    userService.getUserById(id).then(function (response) {
        res.send(response)
    }).catch(function (err) {
        res.send(err)
    });
}
function getAllUser(req, res) {
    userService.getAllUser().then(function (response) {
        res.send(response);
    }).catch(function (err) {
        res.send(err)
    })
}

function createUser(req, res) {
    var request = {
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        companyschool: req.body.companyschool,
        sex: req.body.sex,
        age: req.body.age,
        favorite: req.body.favorite,
        job: req.body.job,
        slogan: req.body.slogan
    };
    userService.createUser(request).then(function (response) {
        res.send(response)
    }).catch(function (err) {
        res.send(err)
    });
}



