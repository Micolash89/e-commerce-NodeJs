export default class ProductDTO {
    static getProduct = (product) => {
        return {
            title: product.title.charAt(0).toUpperCase() + product.title.slice(1),
            description: product.description.charAt(0).toUpperCase() + product.description.slice(1),
            code: product.code,
            price: Number(product.price),
            status: true,
            stock: Number(product.stock),
            category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            url: product.url
        }
    }
    static getModifyProduct = (product) => {
        return {
            title: product.title.charAt(0).toUpperCase() + product.title.slice(1),
            description: product.description.charAt(0).toUpperCase() + product.description.slice(1),
            code: product.code,
            price: Number(product.price),
            stock: Number(product.stock),
            status: true,
            category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            url: product.url
        }
    }
}