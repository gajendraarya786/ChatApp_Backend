import express from 'express';
import { Message } from '../models/message.models.js';
import { messages } from '../controllers/message.controller.js';

const router = express.Router();

router.route("/messages/:room").get(messages);

export default router;