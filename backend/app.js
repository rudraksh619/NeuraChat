import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config();
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import route from './routes/user.routes.js'
import connect  from './db/db.js';
import projectrouter from  './routes/project.routes.js'
import cookieParser from 'cookie-parser';
import airoute from './routes/ai.route.js'

connect()

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/users', route)
app.use('/projects',projectrouter)
app.use('/ai',airoute)
app.get('/',(req,res) =>{
    res.send("hello from the server");
});

export default app;