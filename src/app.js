import express from "express";
import __dirname from './utils.js'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import messageRouter from "./routes/message.router.js";
import productRouter from "./routes/product.router.js";
import cartsRouter from "./routes/carts.router.js";
import cookieParser from 'cookie-parser';
import sessionRouter from "./routes/session.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import session from "express-session";
import config from "./config/config.js";
import errorHandler from "./middlewares/errors/index.js"
import { addLogger } from "./logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import cors from 'cors';



const port = config.port || 8080;

const app = express();
// app.use(cors({ origin: config.all, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(cors({ origin: ["http://localhost:5173", "https://micolash89.github.io"], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
mongoose.connect(config.urlMongo);

//cookie
app.use(cookieParser());

// Handlebars configuración
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}));

/*errors*/
app.use(errorHandler);

/*Logger*/
app.use(addLogger);

initializePassport();
app.use(passport.initialize());
app.use(passport.session()); // permite que los datos de sesión se guarden en la solicitud

/*Documenetación API*/
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del E-commerce',
            description: 'API para el E-commerce',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));


app.use('/chat', messageRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);

const server = app.listen(port, () => console.log("conexion"));