export default class TicketDTO {
    static getTicket = (total, email, products) => {
        return {
            code: Date.now().toString(),
            purchase_datetime: Date.now(),
            amount: total,
            purchaser: email,
            products
        }
    }
}