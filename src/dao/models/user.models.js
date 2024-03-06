import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    role: {
        type: String,
        default: 'user',
    }

});

userSchema.pre('find', function () {
    this.populate("cart.carts");
});

userSchema.pre('findOne', function () {
    this.populate("cart.carts");
});

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;

