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

        // Also save the file to /home/alex/project folder
        const projectPath = path.join('/home/alex/project', 'experiment_results.csv');
        fs.writeFile(projectPath, csvData, (err) => {
            if (err) {
                console.error('Error saving results to project folder:', err);
                return res.status(500).send('Error saving results to project folder');
            }
            res.send('Results saved successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
