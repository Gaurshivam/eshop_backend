require('dotenv').config();
const express = require('express');
const router = express.Router();

const Product = require('../../models/Product');
const Category = require('../../models/Category');
const ProductImage = require('../../models/ProductImage');

// http://localhost:5000/userproduct/getproducts
router.get('/getproducts', async(req, resp)=>{
    try {
        const GetProduct = await Product.find({"product_status":"Enable"}).populate('pro_cat');
        if (!GetProduct) {
            return resp.json({"sts":1,"msg":"product is not found"})
        } else {
            return resp.json({"sts":0,"products":GetProduct})
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;