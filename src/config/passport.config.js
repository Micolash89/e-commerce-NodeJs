import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserDB from "../dao/dbManagers/userDB.js";
import jwt from "passport-jwt";
import GitHubStrategy from "passport-github2";
import CartsDB from './../dao/dbManagers/CartsDB.js';
import config from "./config.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const userDB = new UserDB();
const cartDB = new CartsDB();


const initializePassport = () => {

    passport.use("github", new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.gitHubCallBack,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userDB.findEmail(profile._json.email);
            if (!user) {

                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 0,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userDB.createOne(newUser);
                done(null, result);
            }
            else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userDB.findEmail(username);
            if (user) {
                console.log("El usuario ya existe");
                return done(null, false)
            }

            const cart = await cartDB.createOne();

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                cart: cart._id,
                password: createHash(password)
            }

            let result = await userDB.createOne(newUser);
            return done(null, result);
        } catch (err) {
            return done('Error al obtener el usuario' + err);
        }
    }));
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userDB.findEmail(username);
            if (!user) {
                console.log('usuario no existe')
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.secretKey
    }, async (jwt_payload, done) => {
        try {

            return done(null, jwt_payload);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userDB.getOne(id);
        done(null, user);
    });
}

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[config.cookieToken]
    }
    return token
}
export default initializePassport;