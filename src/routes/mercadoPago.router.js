
import { Router } from 'express';
import { getID } from '../controllers/mercadoPago.controller.js';

const mercadoPagoRouter = Router();


mercadoPagoRouter.post("/create_preference", getID);

export default mercadoPagoRouter;