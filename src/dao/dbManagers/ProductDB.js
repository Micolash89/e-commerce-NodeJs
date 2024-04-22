import { productModel } from "../models/product.model.js";


export default class ProductDB {

    constructor() {

    }

    getAll = async () => await productModel.find().sort({ title: 1 });

    getOne = async (id) => await productModel.findOne({ _id: id });

    createOne = async (obj) => await productModel.create(obj);

    updateuno = async (id, obj) => await productModel.updateOne({ _id: id }, { $set: { title: obj.title, description: obj.description, code: obj.code, price: obj.price, stock: obj.stock, category: obj.category, url: obj.url } });

    modificate = async (id, obj) => await productModel.updateOne({ _id: id }, obj);

    remove = async (id) => await productModel.deleteOne({ _id: id });

    getmyProducts = async (email) => await productModel.find({ owner: email }).lean();

    customSearch = async (search) => await productModel.find({ $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }] })

    // findCategories = async () => await productModel.distinct('category');
    findCategories = async () => await productModel.aggregate([
        // Agrupa por la categoría
        { $group: { _id: "$category", url: { $first: "$url" } } }, { $sort: { "_id": 1 } }
    ]);

}
