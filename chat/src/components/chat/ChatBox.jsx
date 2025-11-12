import React, { useEffect, useState } from "react";

const ChatBox = ({ messages, currentUser, activeUser }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        (msg.sender === currentUser && msg.receiver === activeUser) ||
        (msg.sender === activeUser && msg.receiver === currentUser)
    );
    setChatMessages(filtered);
  }, [messages, activeUser, currentUser]);

  return (
    <div className="chat-box">
      {chatMessages.map((msg) => (
        <div
          key={msg.id}
          className={msg.sender === currentUser ? "message own" : "message"}
        >
          <span className="sender">{msg.sender}</span>
          <span className="content">{msg.content}</span>
          <span className="timestamp">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
