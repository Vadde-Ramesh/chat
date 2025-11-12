const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/fileHelper");
const USERS_FILE = "./data/users.json";
const JWT_SECRET = "your-secret-key"; // Replace with secure secret
const JWT_EXPIRY = "60s"; // 1 minute

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const users = await readJSON(USERS_FILE);
  if (users.find(u => u.username === username)) return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: uuidv4(), username, password: hashedPassword });
  await writeJSON(USERS_FILE, users);
  res.json({ message: "User registered successfully" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const users = await readJSON(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ token });
};

module.exports = { register, login };
