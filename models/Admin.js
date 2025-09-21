const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    admin_email:{
        type:String,
        required:true
    },
    admin_pass:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('eshop_admin',AdminSchema);