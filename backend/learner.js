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
                'Authorization': 'Bearer API_KEY',
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
