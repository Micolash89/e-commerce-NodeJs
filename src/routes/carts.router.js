import { Router } from 'express';
import CartsDB from '../dao/dbManagers/CartsDB.js';
import { addProductToCart, deleteCart, deleteProduct, getCarts, getCartsById, postCart, purchaseCart, putCart, updateCartproduct } from '../controllers/carts.controller.js';
import passport from 'passport';
import { autorization } from '../utils.js';
import TicketDB from '../dao/dbManagers/TicketDB.js';

const ticketDB = new TicketDB();

const cartsRouter = Router();

cartsRouter.get('/', passport.authenticate("jwt", { session: false }), getCartsById);

cartsRouter.get('/all', passport.authenticate("jwt", { session: false }), getCarts);

cartsRouter.post('/', passport.authenticate("jwt", { session: false }), postCart);

cartsRouter.post('/products/:pid', passport.authenticate("jwt", { session: false }), addProductToCart);

cartsRouter.delete('/products/:pid', passport.authenticate("jwt", { session: false }), deleteProduct);

cartsRouter.put('/', passport.authenticate("jwt", { session: false }), putCart);

cartsRouter.put('/products/:pid', passport.authenticate("jwt", { session: false }), updateCartproduct);

cartsRouter.delete('/', passport.authenticate("jwt", { session: false }), deleteCart);

cartsRouter.post('/purchase', passport.authenticate("jwt", { session: false }), purchaseCart);

cartsRouter.get('/owntickets', passport.authenticate("jwt", { session: false }), async (req, res) => {

    try {

        const user = req.user.user;
        console.log(user);
        const ticket = await ticketDB.getTiket(user);

        res.send({ status: "success", payload: ticket });

    } catch (error) {
        res.status(500).send({ status: "error", message: error })
    }


});

export default cartsRouter;