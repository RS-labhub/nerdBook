const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the C++ Code Platform API');
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
