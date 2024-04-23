import CartsDB from "../dao/dbManagers/CartsDB.js";
import ProductDB from "../dao/dbManagers/ProductDB.js";
import TicketDB from '../dao/dbManagers/TicketDB.js'
import TicketDTO from "../dto/TicketDTO.js";


const cartsDB = new CartsDB();
const productsDB = new ProductDB();
const ticketDB = new TicketDB();

export const getCartsById = async (req, res) => {

    try {
        let cid = req.user.user.cart;

        let cart = await cartsDB.getOne(cid);

        // enviar los productos que tienen estado true

        //cart = cart.filter((item) => item.status == true);

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

    const quantity = Number.parseInt(req.body.quantity);
    const productId = req.params.pid;
    const cartId = req.user.user.cart;

    try {

        const prod = await productsDB.getOne(productId);

        if (prod && prod.owner != req.user.user.email && prod.status) {

            // for (let i = 0; i < quantity; i++) {
            //     await cartsDB.addProduct(cartId, productId);
            // }
            await cartsDB.addManyProduct(cartId, productId, quantity);

            return res.send({ status: "success", quantity })

        } else {
            return res.status(403).send({ status: 'error', message: 'you are the owner of this product or the product does exist' });
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
            res.status(500).send({ status: 'error en el carrito', message: error });
        }
        let total = 0;
        let itemsLeft = [];
        let productPurchase = [];
        // Utiliza Promise.all para esperar a que todas las operaciones de productos se completen
        await Promise.all(cart.products.map(async (item) => {

            let product = await productsDB.getOne(item.product._id);
            if (product && product.stock >= item.quantity && product.status) {
                product.stock -= item.quantity;
                total += item.product.price * item.quantity;
                productPurchase.push(item.product._id);
                await productsDB.updateuno(item.product._id, product);
            } else {
                itemsLeft.push(item);
                console.log(`No hay suficiente stock de ${item.product.title}, se agregará a la cola o el producto se dio de baja`);
            }
        }));

        let newTicket;
        if (total == 0) {
            return res.send({ status: 'error', message: 'No hay productos en el carrito' });
        }

        const result = await cartsDB.updateUno(cid, itemsLeft);
        newTicket = TicketDTO.getTicket(total, req.user.user.email, productPurchase)
        const ticket = await ticketDB.createTiket(newTicket);

        return res.send({ status: 'ok', payload: ticket, productsLeft: itemsLeft });

    } catch (error) {

        res.status(500).send({ status: ' error en el try', message: error });

    }
}
