import express from "express";
import __dirname from './utils.js'
import handlebars from 'express-handlebars';
//import { messageModel } from "./src/dao/models/message.model.js";
import mongoose from 'mongoose';
import messageRouter from "./routes/message.router.js";
import productRouter from "./routes/product.router.js";
import cartsRouter from "./routes/carts.router.js";
import cookieParser from 'cookie-parser';
import sessionRouter from "./routes/session.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import session from "express-session";
//import allowInsecurePrototypeAccess from '@handlebars/allow-prototype-access';
import config from "./config/config.js";

const port = config.port || 8080;

const app = express();
mongoose.connect(config.urlMongo);
//const Server = app.listen(8080, () => console.log("conexion"))

//cookie
app.use(cookieParser());

// Handlebars configuración
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
//app.locals.Handlebars = allowInsecurePrototypeAccess(handlebars);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session()); // permite que los datos de sesión se guarden en la solicitud

app.use('/chat', messageRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);

const server = app.listen(port, () => console.log("conexion"));