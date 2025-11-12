const fs = require("fs-extra");

const readJSON = async (filePath) => {
  return fs.readJSON(filePath).catch(() => []);
};

const writeJSON = async (filePath, data) => {
  await fs.writeJSON(filePath, data);
};

module.exports = { readJSON, writeJSON };
