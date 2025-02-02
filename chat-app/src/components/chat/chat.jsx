import React, { useEffect, useState } from 'react';
import { user } from '../join/join';
import './chat.css';
import socketIO from 'socket.io-client';
import Message from '../message/message'; // Corrected import

let newSocket;
const ENDPOINT = 'http://localhost:3000/';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState('');

  const send = () => {
    const message = document.getElementById('chatInput').value;
    socket.emit('message', { message, id });
    document.getElementById('chatInput').value = '';
  };

  useEffect(() => {
    // Initialize the socket connection
    newSocket = socketIO(ENDPOINT, { transports: ['websocket'] });

    // Event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join', { user });
      setId(newSocket.id); // Set socket ID once connected
    });

    newSocket.on('welcome', (data) => {
      console.log(`${data.user}: ${data.message}`);
    });

    newSocket.on('userJoined', (data) => {
      console.log(`${data.user}: ${data.message}`);
    });

    newSocket.on('leave', (data) => {
      console.log(`${data.user}: ${data.message}`);
    });

    // Store the socket in state
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect(); // Properly disconnect
      }
    };
  }, []); // Empty dependency array to run only on mount

  // Listen for messages once socket is set
  useEffect(() => {
    if (socket) {
      socket.on('sendMessage', (data) => {
        console.log(`${data.user}: ${data.message}, ${data.id}`);
      });

      // Cleanup the listener on component unmount
      return () => {
        socket.off('sendMessage'); // Remove event listener
      };
    }
  }, [socket]); // This effect runs when 'socket' is updated

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header"></div>
        <div className="chatBox">
          <Message /> {/* Correctly use the Message component */}
        </div>
        <div className="inputBox">
          <input type="text" id="chatInput" />
          <button className="sendBtn" onClick={send}>
            <img src="/send.png" alt="Send" />
          </button>
        </div>
      </div>
      <h1>{user}</h1>
    </div>
  );
};

export default Chat;
