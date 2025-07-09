import { Message } from "../models/message.models.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected: ", socket.id);

        socket.on("joinRoom", async(room) => {
            socket.join(room);

             try {
            //Fetching previous messages
             const messages = await Message.find({room}).sort({createdAt: 1});
             socket.emit("roomMessages", messages);
            } catch (error) {
               console.log("Error fetching messages: ", error.message)
            }
        });

        socket.on("chatMessage", async({room, sender, content}) => {
            const message = await Message.create({room, sender, content});
            io.to(room).emit("chatMessage", message);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected: ", socket.id);
        });
    });
};

export {socketHandler}