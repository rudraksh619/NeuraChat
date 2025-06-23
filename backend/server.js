import dotenv from 'dotenv'
dotenv.config();
import http from 'http';
import app from './app.js'
import { Server }  from  'socket.io';
import { error } from 'console';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import Project from './models/project.model.js'
import * as  ai from './services/ai.service.js'
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

async function getAiResult(prompt) {
    const result = await ai.generativeResult(prompt);
    return result;
}

io.use(async (socket, next) => {
    console.log("enter")
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    const project_id = socket.handshake.query.project_id;

    if (!token) {
        return next(new Error('Authorization Error'));
    }

    // Check if project_id is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
        return next(new Error('Invalid project_id'));
    }

    socket.project = await Project.findById(project_id).lean();

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decode;
        next();
    } catch (error) {
        return next(new Error("Token expired or invalid"));
    }
});


io.on('connection', socket => {
    socket.roomId =  socket.project._id.toString();
    console.log("room_id is" , socket.roomId);
    console.log("project isisde the socekt",socket.project);
    socket.join(socket.roomId);

    socket.on('project-message',  async data=>{
        console.log("data coming from frontend",data);   
        
        const message = data.message;
        const is_ai_activate = message.includes('@ai');
         socket.broadcast.emit('project-message', data);

        if(is_ai_activate){
            const prompt = message.replace('@ai','')
           const result = await getAiResult(prompt)
           io.to(socket.roomId).emit('project-message',{
            message:result,
            sender:{
                _id:'ai',
                email:'AI',
            }
           });
        }
       
    //   socket.broadcast.emit('project-message', data);


    })
 
    console.log("a user connected");
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { 
    socket.leave(socket.roomId)
  });
});


server.listen(port,(req,res) =>{
    console.log("server is start running at ",port);
})