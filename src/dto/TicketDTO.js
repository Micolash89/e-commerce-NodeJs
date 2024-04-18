

export default class TicketDTO {
    static getTicket = (total, email) => {
        return {
            code: Date.now().toString(),
            purchase_datetime: Date.now(),
            amount: total,
            purchaser: email
        }
    }
}