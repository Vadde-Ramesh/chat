import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ sendMessage, typing, stopTyping }) => {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    sendMessage(message);
    setMessage("");
    stopTyping();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim() === "") stopTyping();
    else typing();
  };

  return (
    <form className="message-input" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleTyping}
      />
      <button type="submit">
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default MessageInput;
