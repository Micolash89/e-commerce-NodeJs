import { Router } from 'express';
import CartsDB from '../dao/dbManagers/CartsDB.js';
import { addProductToCart, deleteCart, deleteProduct, getCarts, getCartsById, postCart, purchaseCart, putCart, updateCartproduct } from '../controllers/carts.controller.js';
import passport from 'passport';
import { autorization } from '../utils.js';

const cartsRouter = Router();

cartsRouter.get('/', passport.authenticate("jwt", { session: false }), getCartsById);

cartsRouter.get('/all', passport.authenticate("jwt", { session: false }), getCarts);

cartsRouter.post('/', passport.authenticate("jwt", { session: false }), postCart);

cartsRouter.post('/products/:pid', passport.authenticate("jwt", { session: false }), autorization("user", "premium"), addProductToCart);

cartsRouter.delete('/products/:pid', passport.authenticate("jwt", { session: false }), deleteProduct);

cartsRouter.put('/', passport.authenticate("jwt", { session: false }), putCart);

cartsRouter.put('/products/:pid', passport.authenticate("jwt", { session: false }), updateCartproduct);

cartsRouter.delete('/', passport.authenticate("jwt", { session: false }), deleteCart);

cartsRouter.post('/purchase', passport.authenticate("jwt", { session: false }), purchaseCart);

export default cartsRouter;