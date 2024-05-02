import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from './../config/config.js';

const client = new MercadoPagoConfig({ accessToken: config.accessTokenMP });

export const getID = async (req, res) => {

    const items = req.body.items.map((item) => {
        return {
            title: item.title,
            quantity: Number(item.quantity),
            unit_price: Number(item.price),
            currency_id: "ARS",
        };
    });

    const url = req.rawHeaders.find(e => e.startsWith("http"));

    try {
        const body = {
            items: items,
            back_urls: {
                success: `${url}/e-commerce-Coder-FrontEnd/#/cart`,
                pending: `${url}/e-commerce-Coder-FrontEnd/#/`,
                failure: `${url}/e-commerce-Coder-FrontEnd/#/`,
            },
            auto_return: "approved",
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    } catch (error) {
        console.log("Error preference", error);
    }

}