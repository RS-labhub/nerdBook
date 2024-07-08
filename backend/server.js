const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the books.json file and handle search queries
app.get('/api/books', (req, res) => {
  fs.readFile(path.join(__dirname, 'books.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading books.json');
      return;
    }
    const books = JSON.parse(data);
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const filteredBooks = books.filter(book => {
      return book.title.toLowerCase().includes(query) ||
             book.aliases.some(alias => alias.toLowerCase().includes(query));
    });
    res.json(filteredBooks);
  });
});

// Handle root endpoint
app.get('/', (req, res) => {
  res.send('This is running smoothly :p');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
