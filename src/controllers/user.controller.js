import config from "../config/config.js";
import UserDB from "../dao/dbManagers/UserDB.js";
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
    const user = UserDTO.getUserLogin(req.user);

    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).status(200).send({ status: 'success', token, user });
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

    res.send({ status: "success", message: "user register success" });
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

        if (!user || newUser.age < 0 || newUser.age > 100 || newUser.first_name.length < 3 || newUser.last_name.length < 3 || newUser.email.length < 3) return res.status(404).send({ status: "error", message: "user not found" });

        const resp = userDB.updateUno(uid, newUser);

        res.send({ status: "success", payload: resp });
    } catch (error) {
        res.status(500).send({ satus: "error", message: error });
    }

}

export const currentSession = (req, res) => {

    const user = UserDTO.getUserLogin(req.user.user);

    res.send({ status: 'success', payload: { user: user } });

}

/*restore password*/

export const getRestorePassword = async (req, res) => {

    res.render('RestorePassword', { style: 'login.css' });

};

export const postRestorePassword = async (req, res) => {

    try {
        const { email } = req.body;

        const url = req.rawHeaders.find(e => e.startsWith("http"))

        const user = await userDB.findEmail(email);

        if (user) {

            const token = generateTokenRestore(user);

            console.log(user);

            sendMailRestore(user, token, url);

            res.send({ status: "success", token });

        }

    } catch (error) {
        return res.status(401).send({ status: 'error', message: error });
    }

}

/*restore password token*/

export const getRestorePasswordToken = async (req, res) => {

    const { token } = req.params;

    const user = extractorTokenRestore(token);

    if (user) {

        res.send({ estatus: "succes", payload: { id: user._id, token } });//ver el token
    } else {
        res.send({ status: "error", message: 'Invalid link or expired.' });
    }

};

export const postRestorePasswordToken = async (req, res) => {

    try {
        const { password, confirm_password } = req.body;
        const { token } = req.params;

        const userToken = extractorTokenRestore(token);

        if (password === confirm_password) {

            const user = {
                _id: userToken._id,
                password: createHash(password)
            }

            const result = await userDB.updateUser(user);
            return res.send({ estatus: "success", payload: result });
        } else {
            throw new Error("Passwords do not match.", 401);
        }

    } catch (error) {

        return res.send({ status: "error", message: error });
    }

};

export const changeRole = async (req, res) => {

    const user = req.user.user;
    if (user.role == "admin") {
        return res.send({ status: "error", message: 'No pudes cambiar el rol , esres Admin' });
    }

    user.role = user.role == "premium" ? "user" : "premium";

    const result = await userDB.updateUser(user);

    const token = generateToken(user);

    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).status(200).send({ status: "success", message: 'Rol cambiado', result });
}