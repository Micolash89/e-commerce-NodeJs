import TicketDB from '../dao/dbManagers/TicketDB.js';

const ticketDB = new TicketDB();

export const getAllTickets = async (req, res) => {

    try {

        const user = req.user.user;

        const ticket = await ticketDB.getAllTiket(user);

        res.send({ status: "success", payload: ticket });

    } catch (error) {
        res.status(500).send({ status: "error", message: error })
    }


}

export const getOneTicket = async (req, res) => {

    try {

        const { tid } = req.params;

        const ticket = await ticketDB.getOneTicket(tid);

        res.send({ status: "success", payload: ticket });

    } catch (error) {
        res.status(500).send({ status: "error", message: error })
    }

}