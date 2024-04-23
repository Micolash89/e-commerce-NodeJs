import { cartsModel } from "../models/carts.model.js";

export default class CartsDB {

    constructor() {

    }

    getAll = async () => await cartsModel.find().lean();

    getOne = async (id) => await cartsModel.findOne({ _id: id }).lean();

    createOne = async () => await cartsModel.create({ products: [] });

    updateUno = async (id, obj) => await cartsModel.updateOne({ _id: id }, { $set: { products: obj } });

    insertUno = async (id, obj) => await cartsModel.insertMany({ _id: id }, obj);

    updateProduct = async (id, obj) => await cartsModel.updateOne({ _id: id }, obj);

    updateAll = async (id, obj) => await cartsModel.updateMany({ _id: id }, obj);

    insertProduct = async (cid, pid) => {

        let cart = await this.getOne(cid);//{} undefined null

        if (cart) {
            //cart.products[]
            console.log(cart.products);
            return;
        } else {
            return { status: "error", message: "cart not found" }
        }

    }

    /*para agregar un producto logica del tp*/
    addProduct = async (cid, pid) => {
        try {

            let cart = await this.getOne(cid);

            if (cart) {
                let products = cart.products || [];
                let prd = products.find(obj => obj.product._id == pid);
                if (prd) {
                    prd.quantity += 1;
                } else {
                    products.push({ product: pid, quantity: 1 })
                }
                cart.products = products;
                const result = await this.updateUno(cid, products);

                return result;

            } else {
                return { status: "error", error: "cart not found" }
            }

        } catch (error) {
            console.log(error);
        }
    };

    /*cambio de requisitos*/
    addManyProduct = async (cid, pid, quan) => {
        try {

            let cart = await this.getOne(cid);

            if (cart) {
                let products = cart.products || [];
                let prd = products.find(obj => obj.product._id == pid);
                if (prd) {
                    prd.quantity += quan;
                } else {
                    products.push({ product: pid, quantity: quan })
                }
                cart.products = products;
                const result = await this.updateUno(cid, products);

                return result;

            } else {
                return { status: "error", error: "cart not found" }
            }

        } catch (error) {
            console.log(error);
        }
    };

    deleteProduct = async (cid, pid) => {
        try {

            const cart = await this.getOne(cid);

            if (cart) {

                let products = cart.products;

                products = products.filter(obj => obj.product._id != pid);

                cart.products = products;

                return await cartsModel.updateOne({ _id: cid }, { $set: { products: products } });
            } else {
                return { status: "error", error: "cart not found" }
            }

        } catch (error) {
            console.log(error);
        }
    }


}
