require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs =require('fs');
const path = require('path');
const shortid = require('shortid');

const router = express.Router();

const Admin = require('../../models/Admin');
const AdminToken = require('../../models/Admintoken');
const Category = require('../../models/Category');

const catDir = path.join(path.resolve(__dirname,'../../','categories'));

//storage engine setup
const catStore = multer.diskStorage({
    destination: './categories/',
    filename: function (req, file, cb) {
        const iname = shortid.generate();
        cb(null, iname + path.extname(file.originalname));
    }
})

//initialize multer
const uploadCat = multer({
    storage: catStore,
    limits: { fileSize: 10240000 }
})

//http://localhost:5000/admincategory/addcategory
router.post('/addcategory', uploadCat.single('cat_img'), async (req, resp) => {
    try {
        const cat_name = req.body.cat_name;
        const cat_img = req.file.filename; // store actual filename

        const newcat = new Category({
            cat_name,
            cat_img
        });

        await newcat.save();
        resp.json({ 'sts': 0, 'msg': 'Category Uploaded' });
    } catch (err) {
        console.error(err);
        resp.status(500).json({ sts: 1, msg: "Error uploading category" });
    }
});

//http://localhost:5000/admincategory/getcat
router.get('/getcat',async(req,resp)=>{
    try {
        const cat = await Category.find();
        if(!cat){
            resp.json({"sts":1,"msg":"No category Found"});
        }else{
             resp.json({"sts":0,cat});
        }
    } catch (error) {
        console.error(error);
    }
})

// http://localhost:5000/admincategory/delcat/:id

router.delete("/delcat/:id",async(req,resp)=>{
    const scat = await Category.findById(req.params.id);
    const cImage = scat.cat_img;

    const filepath = path.join(catDir,cImage)
    try {
        const deletedt = await Category.findByIdAndDelete(req.params.id);
        if(!deletedt){
            return resp.json({"sts":1,"msg":"Category is not Deleted"})
        }else{
            fs.unlinkSync(filepath);
            return resp.json({"sts":0,"msg":"Category Deleted successfully"})
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
