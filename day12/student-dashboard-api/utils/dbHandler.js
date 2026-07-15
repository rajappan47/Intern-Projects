

const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

// Asynchronously reads the database file
async function getStudents() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    return [];
  }
}

// Asynchronously writes updated data back to the database file
async function saveStudents(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Export the helper functions as a module
module.exports = {
  getStudents,
  saveStudents
};