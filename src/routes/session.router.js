import { Router } from 'express';
//import UserDB from './../DAO/managersDB/userDB.js';
import { authToken, createHash, generateToken, isValidPassword } from '../utils.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserDB from '../dao/dbManagers/userDB.js';
import { getFailLogin, getFailRegister, getGithubCallback, getLogOut, getLogin, getPerfil, getRegistrer, postLogin, postRegister } from '../constrollers/user.controller.js';
import { getGithub } from './../constrollers/user.controller.js';

const sessionRouter = Router();

const userDB = new UserDB();

/* LOGIN */

sessionRouter.get('/login', getLogin);

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithub);

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), getGithubCallback);

sessionRouter.get('/faillogin', getFailLogin);

sessionRouter.get('/perfil', getPerfil);

/*REGISTRAR*/

sessionRouter.get('/registrar', getRegistrer);

sessionRouter.post('/registrar', passport.authenticate('register', { failureRedirect: '/failregistrar' }), postRegister);

sessionRouter.get('/failregistrar', getFailRegister);

/*LOOUT*/
sessionRouter.get('/logout', getLogOut);



sessionRouter.get('/restorepassword', async (req, res) => {

    res.render('RestorePassword', { style: 'login.css' });

});

sessionRouter.post('/restorepassword', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userDB.findEmail(email);

        if (user) {

            user.password = createHash(password);

            const resp = await userDB.updateUser(user);

            res.render('login', { style: 'login.css' });

        }

    } catch (error) {
        return res.status(401).send({ status: 'error', message: error });
    }

});


sessionRouter.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {

    res.send({ status: 'success', payload: req.user });

});


export default sessionRouter;