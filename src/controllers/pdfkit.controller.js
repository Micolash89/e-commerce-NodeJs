import { buildPdf } from "../utils.js"
import TicketDB from "../dao/dbManagers/TicketDB.js";

const ticketDB = new TicketDB();

export const generatePDF = async (req, res) => {

    const user = req.user;

    const { tid } = req.params;

    const ticket = await ticketDB.getOneTicket(tid);

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=example.pdf'
    });

    buildPdf(
        (data) => {
            stream.write(data);
        },
        () => {
            stream.end();
        }, user.user, ticket)

}