import { productModel } from '../dao/models/product.model.js';
import ProductDB from '../dao/dbManagers/ProductDB.js';
import { generateProducts } from '../utils.js';
import CustomError from '../services/errors/Custom.Error.js';
import { generateProductErrorInfo } from '../services/errors/info.js';
import EErrors from '../services/errors/enums.js';

const product = new ProductDB();

export const getProduct = async (req, res) => {
    //traigo todos los productos de la db y los renderizo
    let limit = parseInt(req.query.limit) || 5;
    let page = parseInt(req.query.page) || 1;
    let sort = parseInt(req.query.sort) || 1;
    //let query = req.query.query;

    const products = await productModel.paginate({}, { page, limit, sort: { title: sort }, lean: true })
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : '';
    products.isValid = !(page <= 0 || page > products.totalPages);

    products.user = req.user?.user || { first_name: "no login" }

    //res.render("products", products);
    res.send({ status: 'ok', payload: products });
}


export const getProductById = async (req, res) => {
    try {
        let { id } = req.params;

        let resp = await product.getOne(id);

        res.send({ status: 'ok', payload: resp });

    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

export const postProduct = async (req, res) => {
    try {
        let newProduct = req.body;//validar las variables

        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.category) {
            CustomError.createError({
                name: "Product Error",
                cause: generateProductErrorInfo(newProduct),
                message: "Error Trying to create Product",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        if (req.user.user.role == 'premium') {
            newProduct.owner = req.user.user.email;
        }

        let resp = await product.createOne(newProduct);

        res.send({ status: 'ok', message: resp, payload: newProduct });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }
}

export const putProduct = async (req, res) => {
    try {

        let { pid } = req.params;

        let productNew = req.body;

        let prod = await product.getOne(pid);
        if (!prod) {

            return res.status(404).send({ status: 'error', message: 'product not found' });
        }

        //admin f
        //premium v v = v
        // v  f f 
        if (req.user.user.role == 'premium' && prod[0].owner != req.user.user.email) {
            return res.status(403).send({ status: 'error', message: 'you are not the owner of this product' });
        }

        let resp = await product.modificate(pid, productNew);

        res.send({ status: 'ok', message: resp, payload: resp });
    } catch (error) {
        req.logger.warning("no se encontro el producto")
        res.status(500).send({ status: 'error', message: error });
    }
}

export const deleteProduct = async (req, res) => {
    try {

        let { pid } = req.params;

        let prod = await product.getOne(pid);

        if (!prod) {
            return res.status(404).send({ status: 'error', message: 'product not found' });
        }

        if (req.user.user.role == 'premium' && prod[0].owner != req.user.user.email) {
            return res.status(403).send({ status: 'error', message: 'you are not the owner of this product' });
        }

        let resp = await product.remove(pid);

        res.send({ status: 'ok', message: resp, payload: resp });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error });
    }
}

export const getmockingproducts = async (req, res) => {

    const productsFaker = generateProducts();

    console.log(productsFaker);

    res.send({ status: "ok", payload: productsFaker });
}