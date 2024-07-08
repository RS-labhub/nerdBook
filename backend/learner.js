const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // To make HTTP requests

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to handle the user's query
app.post('/ask', async (req, res) => {
    const question = req.body.question;

    try {
        // Query MindsDB
        const response = await axios.post('https://api.mindsdb.com/sql/query', {
            query: `SELECT output FROM coding_chat_helper WHERE question = '${question}'`
        }, {
            headers: {
                'Authorization': 'Bearer bf398ab693f5e13e6f35e11d34ae2216fed5f27ff450a0a14d88f3ce6e0ecbc5',
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
