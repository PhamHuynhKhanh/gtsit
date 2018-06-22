const mongoose = require('mongoose');
const config = require('./../config');

var Schema = mongoose.Schema;

const userSchema = new Schema({
    salt:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date
    },
    modifiedDate:{
        type:Date
    },
    email:{
        required:true,
        type: String
    },
    password:{
        required:true,
        type:String
    },
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    companyschool: {
        required: true, 
        type: String
    },
    sex: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: String
    },
    favorite: {
      required: true,
      type: String
    },
    image: {
      type: String
    },
    fullname:{
        type:String,
        require:true
    },
    job:{
        type:String,
        require:true
    },
    slogan:{
        type:String,
        require:true
    },
    image: {
        type:String,
        require:true
    },
    deleted: {
        type: Number,
        required:true
    }
});
const User = mongoose.model('user',userSchema);

module.exports = User;