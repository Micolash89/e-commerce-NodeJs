import CartsDB from "../dao/dbManagers/CartsDB.js";
import ProductDB from "../dao/dbManagers/ProductDB.js";
import TicketDB from '../dao/dbManagers/TicketDB.js'


const cartsDB = new CartsDB();
const productsDB = new ProductDB();
const ticketDB = new TicketDB();

export const getCartsById = async (req, res) => {

    try {
        let cid = req.user.user.cart;

        let cart = await cartsDB.getOne(cid);

        res.send({ status: 'success', payload: cart });

    } catch (error) {

        res.status(500).send({ status: 'error', message: error });
    }

}

export const getCarts = async (req, res) => {

    try {

        const carts = await cartsDB.getAll();

        res.send({ status: 'success', payload: carts });

    } catch (error) {

        res.status(500).send({ status: 'error', message: error });
    }

}

export const postCart = async (req, res) => {

    try {

        const cart = await cartsDB.createOne();

        if (!cart) new Error;

        res.send({ status: 'success', payload: cart });

    } catch (error) {

        res.status(500).send({ status: 'error', message: error });
    }

}

export const addProductToCart = async (req, res) => {

    try {
        const productId = req.params.pid;
        const cartId = req.user.user.cart;
        //validar que el el producto exista en la base de datos

        const prod = await productsDB.getOne(productId);

        if (prod && prod[0].owner != req.user.user.email) {

            const cart = await cartsDB.addProduct(cartId, productId);

            return res.send({ payload: cart })

        } else {
            return res.status(403).send({ status: 'error', message: 'you are the owner of this product' });
        }



    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }
}

export const deleteProduct = async (req, res) => {

    try {

        const { pid } = req.params;
        const cid = req.user.user.cart;

        const cart = await cartsDB.deleteProduct(cid, pid);

        res.send({ status: 'ok', payload: cart });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }

}

export const putCart = async (req, res) => {

    try {

        const newCart = req.body;
        const cid = req.user.user.cart;

        const resp = await cartsDB.update(cid, newCart);

        res.send({ status: 'ok', payload: resp });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }

}

export const updateCartproduct = async (req, res) => {
    try {

        const { pid } = req.params;
        const cid = req.user.user.cart;
        const newProduct = req.body;

        const cart = await cartsDB.getOne(cid);

        if (cart) {

            let product = cart.products.find(obj => obj.product == pid);//validar que el producto exista

            if (product) {
                product = newProduct;

                const resp = await cartsDB.update(cid, cart);

                res.send({ status: 'ok', payload: resp });

            } else {
                throw new Error("can't find product");
            }

        } else {
            throw new Error("can't find cart");
        }

    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }
}

export const deleteCart = async (req, res) => {

    try {

        const cid = req.user.user.cart;

        const cart = await cartsDB.getOne(cid);

        if (cart) {

            cart.products = [];

            const resp = await cartsDB.update(cid, cart);

            res.send({ status: 'ok', payload: resp });

        } else {
            throw new Error("can't find cart");
        }

    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }

}

export const purchaseCart = async (req, res) => {
    try {

        const cid = req.user.user.cart;

        const cart = await cartsDB.getOne(cid);

        if (!cart) {
            res.status(500).send({ status: 'error', message: error });
        }
        let total = 0;
        let itemsLeft = [];

        // Utiliza Promise.all para esperar a que todas las operaciones de productos se completen
        await Promise.all(cart[0].products.map(async (item) => {
            let product = await productsDB.getOne(item.product._id);
            if (product[0] && product[0].stock >= item.quantity) {
                product[0].stock -= item.quantity;
                total += item.product.price * item.quantity;
                await productsDB.updateuno(item.product._id, product[0]);
            } else {
                itemsLeft.push(item);
                console.log(`No hay suficiente stock de ${item.product.title}, se agregará a la cola`);
            }
        }));

        let newTicket;
        if (total != 0) {
            const result = await cartsDB.updateUno(cid, itemsLeft);
            newTicket = {
                code: Date.now().toString(),
                purchase_datetime: Date.now(),
                amount: total,
                purchaser: req.user.user.email
            }
        }
        const ticket = await ticketDB.createTiket(newTicket);

        res.send({ status: 'ok', payload: ticket });

    } catch (error) {

        res.status(500).send({ status: 'error', message: error });

    }
}
