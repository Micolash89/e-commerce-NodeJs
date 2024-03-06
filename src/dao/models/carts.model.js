import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    //id,
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: Number
        }],
        default: [],
        required: true
    }

});

cartsSchema.pre('find', function () {
    this.populate('products.product');
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
