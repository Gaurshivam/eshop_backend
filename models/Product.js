const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    pro_cat:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'eshop_category'
    },
    product_name: {
        type: String,
        required: true
    },
    product_short_desc: {
        type: String,
        required: true
    },
    product_long_desc: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_org_price: {
        type: Number,
        required: true
    },
    product_sale_price: {
        type: Number,
        required: true
    },
    product_sale_Start_Date: {
        type: Date,
        required: true
    },
    product_sale_End_Date: {
        type: Date,
        required: true
    },
    product_status: {
        type: String,
        enum: ['Pending', 'Enable', 'Disable'],
        default:'Pending',
    }
});

ProductSchema.pre('find',function(next){
    this.populate('pro_cat')
    next()
})
module.exports = mongoose.model("eshop_product", ProductSchema);