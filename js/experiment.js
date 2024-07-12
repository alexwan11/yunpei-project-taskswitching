let taskCounter = 0;
const maxTasks = 50;
let currentTask = '';
let taskStartTime = 0;
const results = [];
let lastTask = '';
let isExperimentRunning = false;

function startExperiment() {
    if (isExperimentRunning) return;
    isExperimentRunning = true;

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area').style.display = 'flex';
    showBothParts();
}

function showBothParts() {
    const leftPart = document.getElementById('left-part-experiment');
    const rightPart = document.getElementById('right-part-experiment');

    leftPart.style.visibility = 'visible';
    rightPart.style.visibility = 'visible';

    setTimeout(displayStimulus, 2000);
}

function displayStimulus() {
    if (taskCounter >= maxTasks) {
        alert("Experiment Completed!");
        hideExperimentScreen();
        downloadResults();
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task-experiment');
    const colorTaskElement = document.getElementById('color-task-experiment');
    const leftPart = document.getElementById('left-part-experiment');
    const rightPart = document.getElementById('right-part-experiment');
    const shapes = ['circle', 'rectangle'];
    const colors = ['yellow', 'blue'];

    let isShapeTask = Math.random() < 0.5;
    let newTask;

    do {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        if (isShapeTask) {
            shapeTaskElement.innerHTML = `<div class="shape-${randomShape}" style="background-color:${randomColor}"></div>`;
            leftPart.style.visibility = 'visible';
            rightPart.style.visibility = 'hidden';
            newTask = { type: 'shape', shape: randomShape, color: randomColor };
        } else {
            colorTaskElement.innerHTML = `<div class="shape-${randomShape}" style="background-color:${randomColor}"></div>`;
            leftPart.style.visibility = 'hidden';
            rightPart.style.visibility = 'visible';
            newTask = { type: 'color', shape: randomShape, color: randomColor };
        }
    } while (newTask.shape === lastTask.shape && newTask.color === lastTask.color && newTask.type === lastTask.type);
    
    currentTask = newTask;
    lastTask = newTask;
    taskStartTime = new Date().getTime();
    taskCounter++;
}

function hideExperimentScreen() {
    document.getElementById('experiment-area').style.display = 'none';
    document.getElementById('left-part-experiment').style.visibility = 'hidden';
    document.getElementById('right-part-experiment').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounter = 0;
    isExperimentRunning = false;
}

function recordResult(task, reactionTime, correct) {
    results.push({
        blockname: task.type + ' task',
        detailedTask: `${task.color} ${task.shape}`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong'
    });
}

function downloadResults() {
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Prepare FormData for the server
    const formData = new FormData();
    formData.append('file', blob, 'experiment_results.csv');

    // Send the CSV file to the server
    fetch('http://121.40.133.54/save-results', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Results saved successfully on the server');
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while saving results: ' + error.message);
    })
    .finally(() => {
        // Always download the CSV file locally
        const encodedUri = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "experiment_results.csv");
        document.body.appendChild(link);
        link.click();
    });
}


document.addEventListener('keydown', (event) => {
    if (!isExperimentRunning) return;

    const key = event.key;
    const reactionTime = new Date().getTime() - taskStartTime;
    let correct = false;

    if (currentTask.type === 'shape') {
        if ((currentTask.shape === 'circle' && key === 'b') || (currentTask.shape === 'rectangle' && key === 'n')) {
            correct = true;
        }
    } else if (currentTask.type === 'color') {
        if ((currentTask.color === 'yellow' && key === 'b') || (currentTask.color === 'blue' && key === 'n')) {
            correct = true;
        }
    }

    recordResult(currentTask, reactionTime, correct);

    if (correct) {
        displayStimulus();
    } else {
        alert('Incorrect! Please press the correct key.');
        clearScreen();
        setTimeout(displayStimulus, 2000);
    }
});

function clearScreen() {
    document.getElementById('shape-task-experiment').innerHTML = '';
    document.getElementById('color-task-experiment').innerHTML = '';
    document.getElementById('left-part-experiment').style.visibility = 'hidden';
    document.getElementById('right-part-experiment').style.visibility = 'hidden';
}

document.getElementById('start-experiment-button').addEventListener('click', startExperiment);
