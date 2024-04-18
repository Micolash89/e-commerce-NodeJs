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
}