const mongoose = require('mongoose')
const Schema= mongoose.Schema;

const refreshTokenSchema = new Schema({
    token:{type:String,unique:true},
    email:{type:String}
   
},{timestamps:true});

module.exports = mongoose.model('RefreshToken',refreshTokenSchema,'refreshToken')