import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import LoginForm from "../components/Auth/LoginForm.jsx";
import RegisterForm from "../components/Auth/RegisterForm.jsx";
import UserList from "../components/Sidebar/UserList.jsx";
import ChatBox from "../components/Chat/ChatBox.jsx";
import MessageInput from "../components/Chat/MessageInput.jsx";
import TypingIndicator from "../components/Chat/TypingIndicator.jsx";
import Notification from "./components/Notification.jsx";
import { connectSocket, getSocket } from "./utils/socket.jsx";
import { getUsers } from "./api/auth.jsx";

const App = () => {
  const { currentUser, logoutUser } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [notification, setNotification] = useState("");

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  // Fetch users
  useEffect(() => {
    if (!currentUser || !currentUser.token) return;
    const fetchUsers = async () => {
      const res = await getUsers(currentUser.token);
      setUsers(res.data.filter((u) => u.username !== currentUser.username));
    };
    fetchUsers();
  }, [currentUser]);

  // Initialize Socket
  useEffect(() => {
    if (!currentUser || !currentUser.token) return;
    const socket = connectSocket(currentUser.token);

    socket.on("connect", () => console.log("Connected to socket"));

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (activeUser !== msg.sender)
        setNotification(`New message from ${msg.sender}`);
    });

    socket.on("typing", ({ nick }) => {
      setTypingUser(nick);
    });

    socket.on("stopTyping", () => setTypingUser(null));

    socket.on("previousMessages", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, activeUser]);

  const sendMessage = (content) => {
    const socket = getSocket();
    if (!activeUser) return;
    const msg = {
      id: Date.now(),
      sender: currentUser.username,
      receiver: activeUser,
      content,
      timestamp: new Date().toISOString(),
    };
    socket.emit("chatMessage", msg);
    setMessages((prev) => [...prev, msg]);
  };

  const typing = () => {
    const socket = getSocket();
    if (!activeUser) return;
    socket.emit("typing", { nick: currentUser.username, to: activeUser });
  };

  const stopTyping = () => {
    const socket = getSocket();
    if (!activeUser) return;
    socket.emit("stopTyping", { nick: currentUser.username, to: activeUser });
  };

  if (!currentUser) {
    return showLogin ? (
      <LoginForm switchToRegister={switchToRegister} />
    ) : (
      <RegisterForm switchToLogin={switchToLogin} />
    );
  }

  return (
    <div className="app-container">
      <Notification message={notification} />
      <div className="sidebar-chat">
        <UserList users={users} activeUser={activeUser} selectUser={setActiveUser} />
        <div className="chat-section">
          <ChatBox messages={messages} currentUser={currentUser.username} activeUser={activeUser} />
          <TypingIndicator typingUser={typingUser} />
          <MessageInput sendMessage={sendMessage} typing={typing} stopTyping={stopTyping} />
        </div>
      </div>
      <button className="logout-btn" onClick={logoutUser}>
        Logout
      </button>
    </div>
  );
};

export default App;
