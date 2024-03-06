import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from 'passport';
import { faker } from '@faker-js/faker';


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

/*token*/
const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret";

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
    return token;
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            req.user = user;
            next();
        })(req, res, next);

    }

}

export const autorization = (role) => {
    return (req, res, next) => {
        if (!req.user.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.user.role !== role) return res.status(403).send({ error: "No permissions" })
        next();
    }
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).send({
            error: "Not authenticated",
        });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Not authorized" });
        req.user = credentials.user;
        next();
    });
};

/*Mocks*/

// Crear una instancia de Faker con el idioma español como predeterminado

export const generateProducts = () => {

    let products = [];

    for (let i = 0; i < 100; i++) {
        products.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.string.alphanumeric(5),
            price: faker.commerce.price(),
            status: faker.datatype.boolean(),
            stock: faker.number.int({ min: 1, max: 100 }),
            category: faker.commerce.department(),
            thumbnails: faker.image.url(),
        })

    }

    return products;
}

export default __dirname;