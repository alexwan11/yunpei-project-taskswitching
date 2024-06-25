const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // 你可以选择任何你喜欢的端口

app.use(bodyParser.json());

// 处理POST请求，保存结果到服务器
app.post('/save-results', (req, res) => {
    const results = req.body.results;
    const filePath = path.join(__dirname, 'experiment_results.csv');

    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Results saved successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
