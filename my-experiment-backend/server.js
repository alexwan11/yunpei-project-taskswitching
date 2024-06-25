const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint to receive experiment results
app.post('/save-results', (req, res) => {
    const results = req.body;

    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    const filePath = path.join(__dirname, 'experiment_results.csv');

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Error saving results:', err);
            return res.status(500).send('Error saving results');
        }

        res.send('Results saved successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
