import { createHash } from "../utils.js"

export default class UserDTO {
    static getUser = (first_name, last_name, email, age, password, cart) => {
        return {
            first_name,
            last_name,
            email,
            age: parseInt(age),
            cart: cart._id,
            password: createHash(password)
        }
    }

    static getUserLogin = (user) => {

        return {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: parseInt(user.age),
            cart: user.cart,
            role: user.role
        }

    }

    static getUserModify = (user) => {

        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: parseInt(user.age),
        }

    }



}