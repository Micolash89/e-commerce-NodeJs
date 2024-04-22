import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'product';

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {//ver q onda despues
        type: [String]
    },
    owner: {
        type: String,
        default: "admin"
    },
    url: {
        type: String,
        default: ""
    }
})

productSchema.plugin(mongoosePaginate);


export const productModel = mongoose.model(productCollection, productSchema);
