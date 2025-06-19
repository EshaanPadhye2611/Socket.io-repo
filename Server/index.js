const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

// Allow CORS for your frontend (replace * with your Vercel URL in production)
app.use(cors({
    origin: "https://socket-io-repo-mwfz.vercel.app/", // e.g., "https://your-frontend.vercel.app"
}));

const server = http.createServer(app);

// Configure CORS for Socket.IO as well
const io = socketio(server, {
    cors: {
        origin: "*", // e.g., "https://your-frontend.vercel.app"
        methods: ["GET", "POST"]
    }
});

const users = [{}];

app.get('/', (req, res) => { 
    res.send('Hello World!'); 
});

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', ({user}) => {
        users[socket.id] = user;
        console.log(user);  
        socket.broadcast.emit('userJoined', {user: "Admin", message: `${users[socket.id]} has joined`});
        socket.emit('welcome', {user: "Admin", message: `Welcome to the chat, ${users[socket.id]}`});
    });

    socket.on('message', ({message, id}) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        io.emit('sendMessage', { user: users[id], message, id, time });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', {user: "Admin", message: `${users[socket.id]} has left`});
        console.log('User has left');
    });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});