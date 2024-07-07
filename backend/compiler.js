const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.post('/run-code', (req, res) => {
    const { code } = req.body;

    // Save code to a temporary file
    const filePath = path.join(__dirname, 'tempCode.cpp');
    const outputPath = path.join(__dirname, 'tempCode.out');
    fs.writeFileSync(filePath, code);

    exec(`g++ ${filePath} -o ${outputPath} && ${outputPath}`, (error, stdout, stderr) => {
        let output = stdout;
        let errorMessage = '';

        if (error) {
            output = stderr;
            errorMessage = error.message;
        }

        // Send back the output and error message
        res.json({
            output,
            error: errorMessage
        });

        // Clean up temporary files
        fs.unlinkSync(filePath);
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
