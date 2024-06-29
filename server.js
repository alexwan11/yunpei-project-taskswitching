const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and handle CORS
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// POST endpoint to save results
app.post('/save-results', (req, res) => {
    const results = req.body;
    console.log('Received results:', results);

    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    const directory = '/home/alex/project';
    const filePath = path.join(directory, 'experiment_results.csv');

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Error saving CSV file:', err);
            res.status(500).send('Error saving results');
        } else {
            console.log('CSV file saved successfully locally');
            res.status(200).send('Results saved successfully');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://121.40.133.54:${port}`);
});
