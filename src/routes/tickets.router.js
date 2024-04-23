import { Router } from 'express';
import passport from 'passport';
import { getAllTickets, getOneTicket } from '../controllers/tickets.controller.js';

const ticketsRouter = Router();

ticketsRouter.get('/owntickets', passport.authenticate("jwt", { session: false }), getAllTickets);

ticketsRouter.get('/getticket/:tid', passport.authenticate("jwt", { session: false }), getOneTicket);

export default ticketsRouter;