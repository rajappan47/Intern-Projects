const libraryService = require('../services/libraryService');
const { setCorsHeaders } = require('../utils/cors');

async function getBooks(req, res) {
  setCorsHeaders(res);
  try {
    const books = await libraryService.getAllBooks();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to retrieve book catalog' }));
  }
}

async function getBookings(req, res) {
  setCorsHeaders(res);
  try {
    const bookings = await libraryService.getAllBookings();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(bookings));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to retrieve bookings list' }));
  }
}

function addbooking(req,res)
{
setCorsHeaders(res);
let body ='';

req.on('data',chunk=>{
body+=chunk.toString();
});

req.on('end',async () => {
try{
const {title, author} = JSON.parse(body);
if(!title || !author)
{
    res.writeHead(400,{'Content-Type': 'application/json'});
    return res.end(JSON.stringify({ error: 'Book ID and Student Name are required.' }));
}

const newBook = libraryService.addbook(title,author);
res.writeHead(201, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(newBook));

}


catch(error){
res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to add book.' }));
}
});
}
function createBooking(req, res) {
  setCorsHeaders(res);

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { bookId, studentName } = JSON.parse(body);

      if (!bookId || !studentName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Book ID and Student Name are required.' }));
      }

      const newBooking = await libraryService.processBookBorrowing(bookId, studentName);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newBooking));
    } catch (error) {
      const statusCode = error.status || 500;
      const errorMessage = error.message || 'Internal Server Error';
      
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: errorMessage }));
    }
  });
}

module.exports = {
  getBooks,
  getBookings,
  createBooking,
  addbooking,
};