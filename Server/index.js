const http = require('http');
const express = require('express');

const cors = require('cors');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
app.use(cors());

const users = [{}];

app.get('/', (req, res) => { 
    res.send('Hello World!'); 
    
});

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', ({user}) => {
        users[socket.id] = user;
        console.log(user);  
        socket.broadcast.emit('userJoined',{user:"Admin", message:`${users[socket.id]} has joined`} );
        socket.emit('welcome', {user:"Admin",message:`Welcome to the chat, ${users[socket.id]}`});

       
        
    });

   socket.on(('message'), ({message, id})=>{
    io.emit('sendMessage',{user:users[id], message, id});

   })
    

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', {user:"Admin", message:`${users[socket.id]} has left`});
        console.log('User has left');
        
    });

   
   
});


server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});