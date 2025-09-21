require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

const router = express.Router();

const Admin = require('../../models/Admin');
const AdminToken = require('../../models/Admintoken');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const ProductImage = require('../../models/ProductImage');

const proDir = path.join(path.resolve(__dirname, '../../', 'products'));

//storage engine setup
const proStore = multer.diskStorage({
    destination: './products/',
    filename: function (req, file, cb) {
        const iname = shortid.generate();
        cb(null, iname + path.extname(file.originalname));
    }
})

//initialize multer
const uploadPro = multer({
    storage: proStore,
    limits: { fileSize: 10240000 }
})

// http://localhost:5000/adminproduct/addproduct
router.post('/addproduct', uploadPro.single('product_thumb'), async (req, resp) => {
    try {
        const pro_cat = req.body.pro_cat;
        const product_name = req.body.product_name;
        const product_short_desc = req.body.product_short_desc;
        const product_long_desc = req.body.product_long_desc;
        const product_org_price = req.body.product_org_price;
        const product_sale_price = req.body.product_sale_price;
        const product_sale_Start_Date = req.body.product_sale_price;
        const product_sale_End_Date = req.body.product_sale_price;
        const product_thumb = req.file.filename; // store actual filename

        const newpro = new Product({
            pro_cat,
            product_name,
            product_short_desc,
            product_long_desc,
            product_org_price,
            product_sale_price,
            product_sale_Start_Date,
            product_sale_End_Date,
            product_thumb
        });

        await newpro.save();
        resp.json({ 'sts': 0, 'msg': 'Product Uploaded' });
    } catch (err) {
        console.error(err);
        resp.status(500).json({ sts: 1, msg: "Error uploading Product" });
    }
})

// http://localhost:5000/adminproduct/viewproducts
router.get('/viewproducts', async (req, resp) => {
    try {
        const response = await Product.find().populate('pro_cat');
        if (!response) {
            return resp.json({ "sts": 1, "msg": "No Product Found" });
        } else {
            const formatedProduct = response.map(product => {
                return {
                    _id: product._id,
                    product_name: product.product_name,
                    product_short_desc: product.product_short_desc,
                    product_long_desc: product.product_long_desc,
                    product_org_price: product.product_org_price,
                    product_sale_price: product.product_sale_price,
                    product_sale_Start_Date: product.product_sale_Start_Date,
                    product_sale_End_Date: product.product_sale_End_Date,
                    product_thumb: product.product_thumb,
                    product_status: product.product_status,
                    category: product.pro_cat ? product.pro_cat.cat_name : "Uncategorized"
                }
            })
            return resp.json({ "sts": 0, response: formatedProduct });
        }
    } catch (error) {
        console.log(error);
    }
})

// http://localhost:5000/adminproduct/changestatus
router.post('/changestatus', async (req, resp) => {
    const { productIds, newStatus } = req.body
    try {
        await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { product_status: newStatus } }
        );
        resp.json({ "msg": "Product Status Updated" })

    } catch (error) {
        console.log(error);
    }
})

// http://localhost:5000/adminproduct/deletepro
router.post('/deletepro', async (req, resp) => {
    const { productIds } = req.body
    try {
        const deleteproduct = await Product.deleteMany(
            { _id: { $in: productIds } }
        );
        resp.json({ "msg": `Total ${deleteproduct.deletedCount} successfully deleted Product` })
    } catch (error) {
        console.log(error);
    }
})

// http://localhost:5000/adminproduct/deleteproduct/
router.delete('/deleteproduct/:id', async (req, resp) => {
    const spro = await Product.findById(req.params.id);
    const product_thumb = spro.product_thumb;
    const filepath = path.join(proDir, product_thumb);
    try {
        const pro = await Product.findByIdAndDelete(req.params.id);
        if (!pro) {
            return resp.json({ "sts": 1, "msg": `Product is not Deleted` })
        } else {
            fs.unlinkSync(filepath);
            return resp.json({ "sts": 0, "msg": `Product is successfully deleted` })
        }
    } catch (error) {
        console.log(error);
    }
})

const uploadImages = multer({storage:proStore});

// http://localhost:5000/adminproduct/uploadimages/
router.post('/uploadimages/:id', uploadImages.array('images'), async(req, resp)=>{
    const productId = req.params.id
    const imagefiles = req.files
    try {
        const imagepromises = imagefiles.map(file=>{
            const newProImg = new ProductImage({
                product_image:file.filename,
                proId:productId
            })
            return newProImg.save();
        })

        await Promise.all(imagepromises);
        resp.json({"msg":"Images uploaded successfully"});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;