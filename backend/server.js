const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json())
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

app.post('/explain', async (req, res) => {
  const { question } = req.body;
  const response = await fetch('http://127.0.0.1:47334/api/projects/mindsdb/models/coding_explainer/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({ data: [{ concept: question }] })
  });

  let data = await response.json();
  res.send(data[0].output);
});

app.post('/chat', async (req, res) => {
  const { question } = req.body;
  const response = await fetch('http://127.0.0.1:47334/api/projects/mindsdb/models/coding_chat_helper/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({ data: [{ question }] })
  });

  let data = await response.json();
  res.send(data[0].output);
});

app.post('/code', async (req, res) => {
  const { sourcecode } = req.body;

  const response = await fetch('http://127.0.0.1:47334/api/projects/mindsdb/models/code_helper/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({ data: [{ sourcecode }] })
  });

  let data = await response.json();
  res.send(data[0].output);
});

app.post('/run-code', (req, res) => {
  const { code } = req.body;

  if (!code) {
      res.json({ output: "can't find code", error: "" });
      return;
  }

  const filePath = path.join(__dirname, 'code.cpp');
  const executablePath = path.join(__dirname, 'code');

  fs.writeFileSync(filePath, code);

  const command = `g++ ${filePath} -o ${executablePath} && ${executablePath}`;

  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Compilation or execution error: ${error}`);
          res.json({ output: stderr, error: error.message });
          return;
      }
      res.json({ output: stdout, error: stderr });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
