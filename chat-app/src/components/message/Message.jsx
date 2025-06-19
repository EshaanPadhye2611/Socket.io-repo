import React from 'react';
import './Message.css';

const Message = ({ message, user, time, messageClass }) => {
  return (
    <div className={`messageBox ${messageClass}`}>
      <p className="messageText">{user ? `${user}: ${message}` : `You: ${message}`}</p>
      <p className="messageTime">{time}</p> {/* Display the time */}
    </div>
  );
};

export default Message;
