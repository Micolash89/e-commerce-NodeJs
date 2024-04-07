export default class ProductDTO {
    static getProduct = (product) => {
        return {
            title: product.title,
            description: product.description,
            code: product.code,
            price: Number.parseFloat(product.price),
            status: true,
            stock: Number.parseInt(product.stock),
            category: product.category,
        }
    }
}