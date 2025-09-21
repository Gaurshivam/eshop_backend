const mongoose = require('mongoose');

const ProductImageSchema = mongoose.Schema({
    product_img: {
        type: String,
        required: true
    },
    proid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'eshop_product'
    }
});
module.exports = mongoose.model("eshop_product_img", ProductImageSchema);