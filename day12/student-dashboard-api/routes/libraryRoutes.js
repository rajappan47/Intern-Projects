const libraryController = require('../controllers/libraryController');
const { setCorsHeaders } = require('../utils/cors');

function handleLibraryRoutes(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS OPTIONS pre-flights
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  // Route mapping
  if (pathname === '/api/books' && method === 'GET') {
    libraryController.getBooks(req, res);
  } else if (pathname === '/api/bookings' && method === 'GET') {
    libraryController.getBookings(req, res);
  } else if (pathname === '/api/bookings' && method === 'POST') {
    libraryController.createBooking(req, res);
  }
  else if(pathname ==='/api/addbook' && method === 'POST')
    {

    } 
  else {
    // 404 Route Not Found
    setCorsHeaders(res);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route path does not exist.' }));
  }
}

module.exports = { handleLibraryRoutes };