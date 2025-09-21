const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({
     uname:{
        type:String,
    },
    uemail:{
        type:String,
        required:true
    },
    upass:{
        type:String,
        required:true
    },
    ustatus:{
        type:String,
        enum:['Enable','Disable'],
        default:'Enable'
    }
})

module.exports= mongoose.model("eshop_user",UserSchema);