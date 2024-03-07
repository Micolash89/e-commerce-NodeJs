import { Router } from 'express';
import ProductBD from '../dao/dbManagers/ProductDB.js';
import uploader from '../utils2.js';
import { productModel } from '../dao/models/product.model.js';
import { getProduct, getProductById, getmockingproducts, postProduct, putProduct } from '../controllers/product.controller.js';
import { deleteProduct } from '../controllers/product.controller.js';
import passport from 'passport';
import { autorization, passportCall } from '../utils.js';


const productRouter = Router();
const product = new ProductBD();

productRouter.get("/", passport.authenticate("jwt", { session: false, failureRedirect: '/api/products/nologin' }), getProduct)

productRouter.get('/nologin', getProduct);

productRouter.get('/:id', getProductById);

/*solo el admin tiene acceso a estos endponts*/
//,passportCall('jwt'),autorization("admin") 
productRouter.post('/', passportCall('jwt'), autorization("admin", "premium"), postProduct);

productRouter.put('/:pid', passportCall('jwt'), autorization("admin", "premium"), putProduct);

productRouter.delete('/:pid', passportCall('jwt'), autorization("admin", "premium"), deleteProduct);

/*MOKS*/
productRouter.get('/mockingproducts/mock', getmockingproducts);

export default productRouter;