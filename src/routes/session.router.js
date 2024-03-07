import { Router } from 'express';
//import UserDB from './../DAO/managersDB/userDB.js';
import { authToken, createHash, extractorTokenRestore, generateToken, isValidPassword, sendMailRestore } from '../utils.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserDB from '../dao/dbManagers/userDB.js';
import { getFailLogin, getFailRegister, getGithubCallback, getLogOut, getLogin, getPerfil, getRegistrer, postLogin, postRegister } from '../controllers/user.controller.js';
import { getGithub } from '../controllers/user.controller.js';

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

/*restaurar y enviar email*/
sessionRouter.post('/restorepassword', async (req, res) => {

    try {
        const { email } = req.body;

        const user = await userDB.findEmail(email);

        if (user) {

            const token = generateToken(user);

            sendMailRestore(user.email, token);

            res.render('login', { style: 'login.css' });

        }

    } catch (error) {
        return res.status(401).send({ status: 'error', message: error });
    }

});

/*link del token, valida el token */
sessionRouter.get('/restorepassword/:token', async (req, res) => {

    const { token } = req.params;

    const user = extractorTokenRestore(token);

    if (user) {

        res.render('RestorePasswordToken', { style: 'login.css', id: user._id, token });//ver el token
    } else {
        res.res({ status: "error", message: 'Invalid link or expired.' });
    }

});

sessionRouter.post('/restorepassword/:token', async (req, res) => {

    const { password, confirm_password, id } = req.body;

    if (password === confirm_password) {

        const user = {
            _id: id,
            password: createHash(password)
        }

        const result = await userDB.updateUser(user);
        console.log(result);
        res.render('login', { style: 'login.css' });
    }

});


sessionRouter.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {

    res.send({ status: 'success', payload: req.user });

});


export default sessionRouter;