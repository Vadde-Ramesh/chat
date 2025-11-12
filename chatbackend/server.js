const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { register, login } = require("./controllers/authController");
const { getUsers } = require("./controllers/userController");
const authMiddleware = require("./middleware/authMiddleware");
const { readJSON, writeJSON } = require("./utils/fileHelper");
const MESSAGES_FILE = "./data/messages.json";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// ----------------- API Routes -----------------
app.post("/register", register);
app.post("/login", login);
app.get("/users", authMiddleware, getUsers);

// ----------------- Socket.io -----------------
const onlineUsers = {}; // username: socket.id

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  const jwt = require("jsonwebtoken");
  const JWT_SECRET = "your-secret-key";
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.username = decoded.username;

    // Disconnect previous session if exists
    if (onlineUsers[socket.username]) {
      io.to(onlineUsers[socket.username]).emit("forceLogout");
      io.sockets.sockets.get(onlineUsers[socket.username])?.disconnect();
    }

    onlineUsers[socket.username] = socket.id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  console.log(`${socket.username} connected`);

  // Send previous messages
  const messages = await readJSON(MESSAGES_FILE);
  socket.emit("previousMessages", messages);

  // Chat message
  socket.on("chatMessage", async (msg) => {
    const messages = await readJSON(MESSAGES_FILE);
    messages.push(msg);
    await writeJSON(MESSAGES_FILE, messages);

    const receiverSocket = onlineUsers[msg.receiver];
    if (receiverSocket) io.to(receiverSocket).emit("chatMessage", msg);

    // Send back to sender as well
    socket.emit("chatMessage", msg);
  });

  // Typing indicator
  socket.on("typing", ({ nick, to }) => {
    const receiverSocket = onlineUsers[to];
    if (receiverSocket) io.to(receiverSocket).emit("typing", { nick });
  });

  socket.on("stopTyping", ({ nick, to }) => {
    const receiverSocket = onlineUsers[to];
    if (receiverSocket) io.to(receiverSocket).emit("stopTyping");
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    delete onlineUsers[socket.username];
  });
});

// ----------------- Start Server -----------------
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
