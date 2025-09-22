require('dotenv').config();

const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const serverless = require("serverless-http");

const app = express();
app.use(BodyParser.json());
app.use(cors());

const db = require('./db');

const uauth = require('./middleware/userauthentication');

//All static Folder
app.use('/categories', express.static(path.join(__dirname, 'categories')));
app.use('/products', express.static(path.join(__dirname, 'products')));

//All Admin routers
const adminLoginRoute = require('./routers/Admin/adminlogin');
const adminCategoryRoute = require('./routers/Admin/category');
const adminProductRoute = require('./routers/Admin/product');

//All User Router
const userRoute = require('./routers/User/user')
const userCategoryRoute = require('./routers/User/category');
const userProductRoute = require('./routers/User/product');

// All Admin route API
app.use('/adminloginapi',adminLoginRoute);
app.use('/admincategory',adminCategoryRoute);
app.use('/adminproduct',adminProductRoute);

// All User Route API
app.use('/userlogreg',userRoute);
app.use('/usercategory',userCategoryRoute);
app.use('/userproduct',userProductRoute);

const port = process.env.PORT

app.get('/',(req,resp)=>{
    resp.send('Hello server');
})

// app.listen(port,()=>{
//     console.log(`Server is running on : http://localhost:${port}`);
    
// });

module.exports = app; // IMPORTANT for Vercel
module.exports.handler = serverless(app);