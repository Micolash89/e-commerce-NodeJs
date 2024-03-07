import config from "../config/config.js";
import { generateToken, sendMail } from "../utils.js";

export const getLogin = async (req, res) => {
    try {
        res.render('login', {});
    } catch (error) {
        console.log(error);
    }
}

export const postLogin = async (req, res) => {
    const token = generateToken(req.user);

    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).status(200).send({ status: 'success' });
}

export const getPerfil = async (req, res) => {
    res.render('perfil', (req.session.user) ? { status: true, profile: req.session.user } : { status: false });
}

export const getGithub = async (req, res) => {
    res.render('perfil', { profile: req.session.user });
}

export const getGithubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/sessions/perfil');//cambiar o ver que onda
}

export const getFailLogin = async (req, res) => {
    res.redirect('/api/sessions/login');
}

export const getRegistrer = async (req, res) => {
    res.render('registrar', {});
}

export const postRegister = async (req, res) => {
    sendMail(req.user.email);
    res.render('login', {});//cambiar un estado(objeto) en usuario registrado o algo por el estilo
}

export const getFailRegister = async (req, res) => {
    console.log("fail Strategy");
    res.status(500).render('registrar', { status: false, message: error.message });
}

export const getLogOut = (req, res) => {
    res.clearCookie(config.cookieToken).redirect('login');
}

