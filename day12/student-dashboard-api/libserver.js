const http = require('http');
const { handleLibraryRoutes } = require('./routes/libraryRoutes');

const PORT = 5001;

const server = http.createServer((req, res) => {
  // Hand off routing to the router layer
  handleLibraryRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Library Backend listening on http://localhost:${PORT}`);
  console.log(` Architecture: Routes -> Controllers -> Services   `);
  console.log(` Warning-Free with modern WHATWG URL parsing       `);
  console.log(`====================================================`);
});