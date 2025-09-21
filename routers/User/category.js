require('dotenv').config();
const express = require('express');
const router = express.Router();

const Category = require('../../models/Category');

// http://localhost:5000/usercategory/getcategory
router.get('/getcategory', async(req, resp)=>{
    try {
        const GetCategory = await Category.find();
        if (!GetCategory) {
            return resp.json({"sts":1,"msg":"Category is not found"})
        } else {
            return resp.json({"sts":0,"categories":GetCategory})
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;