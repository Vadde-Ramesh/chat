const { readJSON } = require("../utils/fileHelper");
const USERS_FILE = "./data/users.json";

const getUsers = async (req, res) => {
  const users = await readJSON(USERS_FILE);
  const otherUsers = users.filter(u => u.username !== req.user.username).map(u => ({ username: u.username }));
  res.json(otherUsers);
};

module.exports = { getUsers };
