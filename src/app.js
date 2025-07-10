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

const app = express();

//Creating an http server

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(cookieParser());
app.use(cors({origin: "https://talksy-bq2qbn4m6-gajendraarya786s-projects.vercel.app/", credentials: true}));
app.use(express.json({limit: "40kb"}))
app.use(express.urlencoded({limit: "40kb"}));




//routes
app.use("/api/v1/users", userRouter);


socketHandler(io);

server.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})