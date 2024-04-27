import { Router } from 'express';
import { generatePDF } from '../controllers/pdfkit.controller.js';
import { passportCall } from '../utils.js';

const pdfkitRouter = Router();

pdfkitRouter.get('/generatepdf/:tid', passportCall('jwt'), generatePDF);

export default pdfkitRouter;