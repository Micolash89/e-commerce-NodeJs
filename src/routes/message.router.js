import { Router } from "express";
import MessageDB from "../dao/dbManagers/MessageDB.js";
import { passportCall, autorization } from "../utils.js";

const messageRouter = Router();
const message = new MessageDB();


messageRouter.get('/', async (req, res) => {

    let messages = await message.getAll();

    res.render('chat', { messages });


})

messageRouter.post('/', passportCall('jwt'), autorization("user"), async (req, res) => {

    const body = req.body;

    await message.createOne(body);//poner q onda con la respuesta hacer un ,consolog log

    let messages = await message.getAll();
    let last = messages[messages.length - 1];
    let exist = messages[messages.length - 1] != undefined;
    res.render('chat', { messages, last, exist });

})

export default messageRouter;