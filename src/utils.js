import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import passport from 'passport';
import { faker, ur } from '@faker-js/faker';
import nodemailer from 'nodemailer';
import config from './config/config.js';
import PDFDocument from 'pdfkit-table';


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

export const sendMail = async (email, url) => {

    await transporter.sendMail({
        from: `E-comerce`,// sender address cambiar para mas adelante
        to: email,//req.user.user.email
        subject: 'Registrado ✔', //cambiar titulo
        html: `
        <section style="font-family: Hanken Grotesk, sans-serif; background-color: #f9f9f9; text-align: center; padding: 15px;">

        <table style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <tr>
                <td colspan="2" style="background-color: #008ecc; height: 30px;"></td>
            </tr>
            <tr>
                <td style="width: 50%; border-bottom: 1px solid #05abf3; text-align: left; padding: 5% 0;">
                    <h2 style="font-size: 2rem; margin: 0; text-transform: capitalize; color: #008ecc;">¡Bienvenido a nuestro <br/> E-commerce <strong>MegaMart</strong>!</h2>
                    <p style="font-size: 1rem;">Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte como parte de nuestra familia.</p>
                    <ul>
                        <li style="font-size: 0.875rem;">Explorar una amplia gama de productos.</li>
                        <li style="font-size: 0.875rem;">Realizar compras de forma segura y conveniente.</li>
                        <li style="font-size: 0.875rem;">Gestionar tu carrito de compra y ver tus pedidos.</li>
                    </ul>
                </td>
                <td style="width: 50%; border-bottom: 1px solid #05abf3; overflow: hidden;">
                    <img style="width: 50%;max-width: 100%; height: 50%; display: block; margin: 0 auto;" src="cid:sign_up" alt="sign up">
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 15px; text-align: center;">
                    <p style="font-size: 1rem; margin-bottom: 15px;">¡Comienza a explorar nuestro catálogo ahora mismo!</p>
                    <a href="${url}/e-commerce-Coder-FrontEnd/#/login" style="padding: 10px 20px; background-color: #008ecc; color: white; text-decoration: none; border-radius: 15px; text-transform: uppercase; box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.6);">Iniciar Sesión</a>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="background-color: #008ecc; height: 30px;"></td>
            </tr>
        </table>
    
    </section>

        `,
        attachments: [{
            filename: 'sign_up.png',//nombre del archivo guardado en tu carpeta images
            path: __dirname + '/images/sign_up.png',//foto del ecomerce
            cid: 'sign_up'//nombre del archivo o algo por el estilo
        }]
    })

}
export const sendMailRestore = async (user, token, url) => {

    await transporter.sendMail({
        from: `E-comerce`,// sender address cambiar para mas adelante
        to: user.email,//req.user.user.email
        subject: 'Restaurar password ✔', //cambiar titulo
        html: `
        <section style="font-family: Hanken Grotesk, sans-serif; background-color: #f9f9f9; text-align: center; padding: 15px;">

    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td colspan="2" style="background-color: #008ecc; height: 30px;"></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: left; padding: 5%;">
                <h2 style="font-size: 2rem; margin: 0; text-transform: capitalize; color: #008ecc;">Restablecer Contraseña</h2>
                <p style="font-size: 1rem;">Hemos recibido una solicitud para restablecer tu contraseña. Sigue los siguientes pasos para completar el proceso:</p>
                <ol>
                    <li style="font-size: 0.875rem;">Haz clic en el siguiente enlace para restablecer tu contraseña:</li>
                </ol>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center; padding: 5%;">
                <a href="${url}/e-commerce-Coder-FrontEnd/#/restorepassword/${token}" style="padding: 10px 20px; background-color: #008ecc; color: white; text-decoration: none; border-radius: 15px; text-transform: uppercase; box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.6);">Restablecer Contraseña</a>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: left; padding: 5%;">
                <p style="font-size: 1rem;">Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo electrónico o ponerte en contacto con nosotros.</p>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="width: 50%; padding: 5%;overflow: hidden;">
                <img style="width: 50%;max-width: 100%; height: 50%; display: block; margin: 0 auto;" src="cid:login"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="background-color: #008ecc; height: 30px;"></td>
        </tr>
    </table>

</section>

`,//cambiar html

        attachments: [{
            filename: 'login.png',//nombre del archivo guardado en tu carpeta images
            path: __dirname + '/images/login.png',//foto del ecomerce
            cid: 'login'//nombre del archivo o algo por el estilo
        }]
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

export const getCookie = (cookiesString) => {

    // let cookie2 = ""
    // cookie2.includes()

    // console.log(cookiesString);
    const cookies = {};
    if (cookiesString) {

        cookiesString.forEach((cookie) => {
            if (cookie.includes(config.cookieToken)) {
                const [key, value] = cookie.trim().split('=');
                cookies[key] = value;
            }
        });
        // console.log(cookies[config.cookieToken]);
        return cookies[config.cookieToken];
    }

    return null;

}

/*buildPDF*/
export function buildPdf(dataCallback, endCallback, user, ticket) {

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    const anchoPagina = doc.page.width;
    const altoPagina = doc.page.height;

    doc.fontSize(18)
        .fillColor('#008ecc')
        .text('MegaMart')
        .fillColor('#000000')
        .fontSize(13)
        .text('Confirmación De Orden')
        .fontSize(10)
        .text('• N° Ticket: ' + ticket.code)
        .text('• Fecha:  ' + ticket.purchase_datetime)
        .text("\n");

    let textX = doc.x;
    let textY = doc.y;

    doc.moveTo(textX, textY)
        .lineTo(textX + 500, textY)
        .stroke();

    doc.text("\n")
        .fontSize(13)
        .text('Detalles De Cliente: ')
        .fontSize(10)
        .text('• Id: ' + user._id)
        .text('• Cliente: ' + user.firt_name + ' ' + user.last_name)
        .text('• Email: ' + user.email)
        .text('• Rol: ' + user.role)
        .text("\n");

    textX = doc.x;
    textY = doc.y;

    doc.moveTo(textX, textY)
        .lineTo(textX + 500, textY)
        .stroke();

    doc.text("\n")
        .text('¡Hola,' + user.firt_name + "!")
        .text('Gracias por comprar con nosotros. Te enviaremos una confirmación cuando tusartículos sean enviados. Esperamos verte de nuevo pronto.')
        .text("\n")
        .text("\n");

    let rows = [];

    ticket.products.forEach(element => {
        rows.push([element.product.title, "$" + element.product.price, element.quantity, "$" + element.product.price * element.quantity])
    });

    let tableArray = {
        headers: ["Nombre", "precio", "cantidad", "subtotal"],
        rows,
    };
    doc.table(tableArray, { width: 500 });


    tableArray = {
        headers: ["", "", "", ""],
        rows: [["Total a pagar: ", "", "", "$" + ticket.amount]],
    };

    doc.table(tableArray, { width: 500 });

    const texto = 'E-commerce MegaMart. Gracias por comprar con nosotros. Enviaremos una confirmación cuando tus productos sean enviados. Esperamos verte pronto.Todos los derechos reservados © MegaMart.'


    // Calcular la anchura del texto
    const anchoTexto = doc.widthOfString(texto);

    // Calcular la posición x del texto para centrarlo horizontalmente
    const x = ((anchoPagina - anchoTexto) / 2) + 100;

    // Calcular la posición y del texto para situarlo en la parte inferior
    const y = altoPagina - 50; // Puedes ajustar el valor 50 según sea necesario

    // Agregar el texto a la posición calculada
    doc.text(texto, x, y, {
        align: 'center'
    });

    doc.end();
}


export default __dirname;