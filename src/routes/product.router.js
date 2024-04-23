import { Router } from 'express';
import uploader from '../utils2.js';
import { getProduct, getProductById, getmockingproducts, postProduct, putProduct, getmyProducts, customSearch, findCategories } from '../controllers/product.controller.js';
import { deleteProduct } from '../controllers/product.controller.js';
import { autorization, passportCall } from '../utils.js';

const productRouter = Router();

productRouter.get("/", getProduct)

productRouter.get('/nologin', getProduct);

productRouter.get('/:id', getProductById);

productRouter.get('/custom/search', customSearch);

productRouter.get('/find/categories', findCategories);

/*solo el admin tiene acceso a estos endponts*/

productRouter.post('/', passportCall('jwt'), autorization("admin", "premium"), postProduct);

productRouter.put('/:pid', passportCall('jwt'), autorization("admin", "premium"), putProduct);

productRouter.delete('/:pid', passportCall('jwt'), autorization("admin", "premium"), deleteProduct);

productRouter.get('/user/myproducts', passportCall('jwt'), autorization("admin", "premium"), getmyProducts);

/*MOKS*/
productRouter.get('/mockingproducts/mock', getmockingproducts);

export default productRouter;