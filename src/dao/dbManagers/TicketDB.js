import ticketModel from "../models/ticket.model.js";

export default class TicketDB {
    constructor() { }

    createTiket = async (obj) => await ticketModel.create(obj)

}