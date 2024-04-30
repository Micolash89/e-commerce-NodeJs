import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    urlMongo: process.env.URL_MONGO,
    gitHubCallBack: process.env.URL_GITHUB_CALL_BACK,
    clientSecret: process.env.CLIENT_SECRET,
    clientId: process.env.CLIENT_ID,
    cookieToken: process.env.COOKIE_TOKEN,
    secretKey: process.env.SECRET_KEY,
    emailUser: process.env.EMAIL_USER,
    passwordAppGoogle: process.env.PASSWORD_EMAIL_APP_GOOGLE,
    dev: process.env.URL_DEV,
    prod: process.env.URL_PROD,
    all: process.env.URL_ALL,
    accessTokenMP: process.env.ACCESS_TOKEN_MP
}