import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io';
import {socketHandler} from './socket/socket.js'
import connectDb from './DB/db.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

//importing routes
import userRouter from './routes/user.routes.js'


dotenv.config();


connectDb();

const PORT = process.env.PORT || 8080;
const app = express();

//Creating an http server

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json({limit: "40kb"}))
app.use(express.urlencoded({limit: "40kb"}));

app.get("/", (req, res) => {
  res.send("API is running!");
});


//routes
app.use("/api/v1/users", userRouter);


socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})