const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to save results
app.post('/save-results', (req, res) => {
    const results = req.body;

    // Generate CSV content
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    // Save CSV file locally
    const filePath = path.join(__dirname, 'project', 'experiment_results.csv');
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
