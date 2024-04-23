import { Router } from 'express';
import passport from 'passport';
import { getAllTickets } from '../controllers/tickets.controller.js';

const ticketsRouter = Router();

ticketsRouter.get('/owntickets', passport.authenticate("jwt", { session: false }), getAllTickets);