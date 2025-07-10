import { Message } from "../models/message.models.js";

const messages = async(req, res) => {
     try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
}

export {messages}