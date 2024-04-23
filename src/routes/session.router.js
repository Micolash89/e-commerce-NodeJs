import { Router } from 'express';
import passport from 'passport';
import { getFailLogin, getFailRegister, getGithubCallback, getLogOut, getLogin, getPerfil, getRegistrer, putEditProfile, postLogin, postRegister, currentSession, getRestorePassword, changeRole, postRestorePassword, getRestorePasswordToken, postRestorePasswordToken } from '../controllers/user.controller.js';
import { getGithub } from '../controllers/user.controller.js';

const sessionRouter = Router();

/* LOGIN */

sessionRouter.get('/login', getLogin);

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), postLogin);

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithub);

sessionRouter.get('/githubcallback', passport.authenticate('github'), getGithubCallback);

sessionRouter.get('/faillogin', getFailLogin);

sessionRouter.get('/perfil', getPerfil);

/*REGISTRAR*/

sessionRouter.get('/registrar', getRegistrer);

sessionRouter.post('/registrar', passport.authenticate('register', { failureRedirect: '/failregistrar' }), postRegister);

sessionRouter.get('/failregistrar', getFailRegister);

/*LOOUT*/
sessionRouter.get('/logout', getLogOut);

/*editar perfil*/

sessionRouter.put('/editprofile/:uid', passport.authenticate("jwt", { session: false }), putEditProfile);

/*cambiar role*/

sessionRouter.get('/changerole', passport.authenticate("jwt", { session: false }), changeRole)

/*restaurar y enviar email*/

sessionRouter.get('/restorepassword', getRestorePassword);

sessionRouter.post('/restorepassword', postRestorePassword);

/*link del token, valida el token */

sessionRouter.get('/restorepassword/:token', getRestorePasswordToken);

sessionRouter.post('/restorepassword/:token', postRestorePasswordToken);

sessionRouter.get('/current', passport.authenticate("jwt", { session: false }), currentSession);


export default sessionRouter;