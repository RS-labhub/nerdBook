const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const books = [
    {
        title: "Book 1",
        description: "Description for Book 1",
        image_url: "https://via.placeholder.com/150",
        pdf_url: "https://example.com/book1.pdf"
    },
    {
        title: "Book 2",
        description: "Description for Book 2",
        image_url: "https://via.placeholder.com/150",
        pdf_url: "https://example.com/book2.pdf"
    },
    {
        title: "Book 3",
        description: "Description for Book 3",
        image_url: "https://via.placeholder.com/150",
        pdf_url: "https://example.com/book3.pdf"
    }
];

// Handle root endpoint
app.get('/', (req, res) => {
    res.send('Backend server is running.'); // Example response
});

app.get('/api/books', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    res.json(filteredBooks);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
