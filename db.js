require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB");
})

mongoose.connection.on('error',(error)=>{
    console.log("Error is : ",error);
})

module.exports = mongoose;