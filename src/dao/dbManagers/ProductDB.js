import { productModel } from "../models/product.model.js";


export default class ProductDB {

    constructor() {

    }

    getAll = async () => await productModel.find();

    getOne = async (id) => await productModel.findOne({ _id: id });

    createOne = async (obj) => await productModel.create(obj);

    updateuno = async (id, obj) => await productModel.updateOne({ _id: id }, { $set: { title: obj.title, description: obj.description, code: obj.code, price: obj.price, stock: obj.stock, category: obj.category, thumbnail: obj.thumbnail } });

    modificate = async (id, obj) => await productModel.updateOne({ _id: id }, obj);

    remove = async (id) => await productModel.deleteOne({ _id: id });

    getmyProducts = async (email) => await productModel.find({ owner: email }).lean();

    customSearch = async (search) => await productModel.find({ $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }] })

    findCategories = async () => await productModel.distinct('category');

}
