import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from 'passport';
import { faker } from '@faker-js/faker';
import nodemailer from 'nodemailer';
import config from './config/config.js';


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

/*token*/
const PRIVATE_KEY = config.secretKey;

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
    return token;
};
export const generateTokenRestore = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
    return token;
};

export const extractorTokenRestore = (token) => {
    let user;
    try {

        user = jwt.verify(token, PRIVATE_KEY).user;

    } catch (error) {
        console.log("token invalido", error.message);
        return null;
    }

    return user;
}

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

export const autorization = (...role) => {
    return (req, res, next) => {

        role.includes(req.user.user.role) ? next() : res.status(403).send({ error: "No permissions" })

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

/*mailing*/

const transporter = nodemailer.createTransport({

    service: 'gmail',
    port: 587,
    auth: {
        user: config.emailUser,
        pass: config.passwordAppGoogle
    }

})

export const sendMail = async (email) => {

    await transporter.sendMail({
        from: `E-comerce`,// sender address cambiar para mas adelante
        to: email,//req.user.user.email
        subject: 'Registrado ✔', //cambiar titulo
        html: `
        <div>
            <h1>Hello world?</h1>
            <img src='cid:perrito1'/>
        </div>
        `,//cambiar html
        // attachments: [{
        //     filename: 'perrito1.jpg',//nombre del archivo guardado en tu carpeta images
        //     path: __dirname + '/img/perrito1.jpg',//foto del ecomerce
        //     cid: 'perrito1'//nombre del archivo o algo por el estilo
        // }]
    })

}
export const sendMailRestore = async (email, token) => {

    await transporter.sendMail({
        from: `E-comerce`,// sender address cambiar para mas adelante
        to: email,//req.user.user.email
        subject: 'Restaurar password ✔', //cambiar titulo
        html: `
        <div>
            <a href="http://localhost:8080/api/sessions/restorepassword/${token}">Click aqui para restaurar</a>
        </div>
        `,//cambiar html
        // attachments: [{
        //     filename: 'perrito1.jpg',//nombre del archivo guardado en tu carpeta images
        //     path: __dirname + '/img/perrito1.jpg',//foto del ecomerce
        //     cid: 'perrito1'//nombre del archivo o algo por el estilo
        // }]
    })

}


/*Mocks*/

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