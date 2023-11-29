import { Router } from "express";
import { messagesManager } from "../DAO/mongodb/managers/messagesManager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const messages = await messagesManager.findAll();
        res.render('chat', { messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { username, message } = req.body;
    if ( !message) {
        res.status(400).json({ message: "Required data is missing" });
    }
    try {
        const newMessage = await messagesManager.createOne(req.body);
        const username = await req.body.username;
        const messages = await messagesManager.findAll(); 
        res.render('chat', { messages, username});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
