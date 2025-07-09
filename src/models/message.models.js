import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: {
        type: String
    },
    content: {
        type: String,
    },
    room: {
        type: String,
        required: true,
    }
},{timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export {Message}