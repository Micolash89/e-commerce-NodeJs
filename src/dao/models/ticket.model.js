import mongoose from "mongoose";

const ticketCollection = "tickets";
const ticketSchema = new mongoose.Schema({

    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String
    },
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

ticketSchema.pre('find', function () {
    this.populate('products.product');
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;