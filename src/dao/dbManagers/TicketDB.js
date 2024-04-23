import ticketModel from "../models/ticket.model.js";

export default class TicketDB {
    constructor() { }

    createTiket = async (obj) => await ticketModel.create(obj);

    getAllTiket = async (obj) => await ticketModel.find({ purchaser: obj.email });

    getOneTicket = async (id) => await ticketModel.findOne({ _id: id });

}