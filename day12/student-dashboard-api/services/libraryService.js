const { readDB, writeDB } = require('../utils/libdbHandler');

async function getAllBooks() {
  const db = await readDB();
  return db.books;
}

async function getAllBookings() {
  const db = await readDB();
  return db.bookings;
}

async function processBookBorrowing(bookId, studentName) {
  const db = await readDB();
  const bookIndex = db.books.findIndex(b => b.id === parseInt(bookId));

  if (bookIndex === -1) {
    throw { status: 404, message: 'Book not found.' };
  }

  if (!db.books[bookIndex].available) {
    throw { status: 400, message: 'Book is already checked out.' };
  }

  // Update book availability state
  db.books[bookIndex].available = false;

  const newBooking = {
    id: Date.now(),
    bookId: parseInt(bookId),
    bookTitle: db.books[bookIndex].title,
    studentName,
    bookingDate: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  await writeDB(db);

  return newBooking;
}
async function addbook()
{
  const db = await readDB();
  const  newBook =
  {
    id:Data.now(),
    title,
    author,
    available: true
  }
  db.books.push(newBook);
  await writeDB(db);
  return newBook;

}

module.exports = {
  getAllBooks,
  getAllBookings,
  processBookBorrowing,
  addbook
};