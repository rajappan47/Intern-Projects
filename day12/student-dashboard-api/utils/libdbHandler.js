const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../libdb.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { books: [], bookings: [] };
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readDB, writeDB };