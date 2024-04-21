import config from "../config/config.js";
import UserDB from "../dao/dbManagers/userDB.js";
import UserDTO from "../dto/UserDTO.js";
import { generateToken, sendMail } from "../utils.js";

const userDB = new UserDB()

export const getLogin = async (req, res) => {
    try {
        res.render('login', {});
    } catch (error) {
        console.log(error);
    }
}

export const postLogin = async (req, res) => {
    const token = generateToken(req.user);

    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).status(200).send({ status: 'success', token });
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
    //res.render('login', {});//cambiar un estado(objeto) en usuario registrado o algo por el estilo
    res.send({ status: "success" });//cambiar un estado(objeto) en usuario registrado o algo por el estilo
}

export const getFailRegister = async (req, res) => {
    console.log("fail Strategy");
    res.status(500).render('registrar', { status: false, message: error.message });
}

export const getLogOut = (req, res) => {
    res.clearCookie(config.cookieToken)
    res.send({ status: "ok", payload: { message: "logout success" } });

}


export const putEditProfile = (req, res) => {

    const { uid } = req.params;

    const newUser = UserDTO.getUserModify(req.body);

    const user = userDB.getOneId(uid);

    try {

        if (!user) return res.status(404).send({ status: "error", message: "user not found" });

        const resp = userDB.updateUno(uid, newUser);

        res.send({ status: "success", payload: resp });
    } catch (error) {
        res.status(500).send({ satus: "error", message: error });
    }


}