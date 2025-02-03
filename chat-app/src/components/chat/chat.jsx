import React, { useEffect, useState } from 'react';
import { user } from '../join/join';
import './chat.css';
import socketIO from 'socket.io-client';
import Message from '../message/message';
import ReactScrollToBottom from "react-scroll-to-bottom";

let newSocket;
const ENDPOINT = 'http://localhost:3000/';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState('');
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById('chatInput').value;
    if (message.trim() === '') return; // Prevent empty messages

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log('Sending message:', message, 'at', time); // Log time before sending

    socket.emit('message', { message, id, time });

    document.getElementById('chatInput').value = '';
  };

  useEffect(() => {
    newSocket = socketIO(ENDPOINT, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join', { user });
      setId(newSocket.id);
    });

    newSocket.on('welcome', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('userJoined', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('leave', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('sendMessage', (data) => {
        console.log('Received message:', data); // Log received message
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off('sendMessage');
      };
    }
  }, [socket]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>Meta Talk</h2>
          <a href="/"><img src="/closeIcon.png" alt="Close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, index) => (
            <Message 
              key={index}
              user={item.id === id ? '' : item.user} 
              message={item.message} 
              time={item.time} // Pass the timestamp
              messageClass={item.id === id ? 'right' : 'left'}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input onKeyPress={(e) => e.key === 'Enter' ? send() : null} type="text" id="chatInput" />
          <button className="sendBtn" onClick={send}>
            <img src="/send.png" alt="Send" />
          </button>
        </div>
      </div>
     
    </div>
  );
};

export default Chat;
