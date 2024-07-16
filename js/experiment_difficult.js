let taskCounterDifficult = 0;
const maxTasksDifficult = 50;
let currentTaskDifficult = '';
let taskStartTimeDifficult = 0;
let lastTaskDifficult = '';
let isExperimentDifficultRunning = false;
const resultsDifficult = [];

function startExperimentDifficult() {
    if (isExperimentDifficultRunning) return;
    isExperimentDifficultRunning = true;

    // Clear the results array to reset data cache
    resultsDifficult.length = 0;

    // Hide instructions and show the experiment area
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area-difficult').style.display = 'flex';

    // Show instructions for 2 seconds before starting the task
    setTimeout(() => {
        displayStimulusDifficult();
    }, 2000);
}

function displayStimulusDifficult() {
    if (taskCounterDifficult >= maxTasksDifficult) {
        alert("Experiment Completed!");
        hideExperimentScreenDifficult();
        downloadResultsDifficult();
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task-experiment-difficult');
    const colorTaskElement = document.getElementById('color-task-experiment-difficult');
    const leftPart = document.getElementById('left-part-experiment-difficult');
    const rightPart = document.getElementById('right-part-experiment-difficult');
    const shapes = ['circle', 'rectangle', 'triangle', 'star'];
    const colors = ['yellow', 'blue', 'green', 'red'];

    let isShapeTask = Math.random() < 0.5;
    let newTask;

    // Clear previous task
    shapeTaskElement.innerHTML = '';
    colorTaskElement.innerHTML = '';
    leftPart.style.visibility = 'hidden';
    rightPart.style.visibility = 'hidden';

    do {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (isShapeTask) {
            if (randomShape === 'triangle') {
                shapeTaskElement.innerHTML = `<div class="shape-${randomShape}" style="border-bottom-color:${randomColor};"></div>`;
            } else if (randomShape === 'star') {
                shapeTaskElement.innerHTML = `<div class="shape-${randomShape}" style="color:${randomColor};"></div>`;
            } else {
                shapeTaskElement.innerHTML = `<div class="shape-${randomShape}" style="background-color:${randomColor};"></div>`;
            }
            leftPart.style.visibility = 'visible';
            rightPart.style.visibility = 'hidden';
            newTask = { type: 'shape', shape: randomShape, color: randomColor };
        } else {
            if (randomShape === 'triangle') {
                colorTaskElement.innerHTML = `<div class="shape-${randomShape}" style="border-bottom-color:${randomColor};"></div>`;
            } else if (randomShape === 'star') {
                colorTaskElement.innerHTML = `<div class="shape-${randomShape}" style="color:${randomColor};"></div>`;
            } else {
                colorTaskElement.innerHTML = `<div class="shape-${randomShape}" style="background-color:${randomColor};"></div>`;
            }
            leftPart.style.visibility = 'hidden';
            rightPart.style.visibility = 'visible';
            newTask = { type: 'color', shape: randomShape, color: randomColor };
        }
    } while (newTask.shape === lastTaskDifficult.shape && newTask.color === lastTaskDifficult.color && newTask.type === lastTaskDifficult.type);

    currentTaskDifficult = newTask;
    lastTaskDifficult = newTask;
    taskStartTimeDifficult = new Date().getTime();
    taskCounterDifficult++;
}

function hideExperimentScreenDifficult() {
    document.getElementById('experiment-area-difficult').style.display = 'none';
    document.getElementById('left-part-experiment-difficult').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-difficult').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounterDifficult = 0;
    isExperimentDifficultRunning = false;
}

function recordResultDifficult(task, reactionTime, correct, pressedKey) {
    resultsDifficult.push({
        blockname: task.type + ' task',
        detailedTask: `${task.color} ${task.shape || 'circle'}`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong',
        pressedKey: pressedKey
    });
}

function downloadResultsDifficult() {
    const csvHeader = "blockname,detailed task,reaction time,rw,pressed key\n";
    const csvContent = resultsDifficult.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw},${e.pressedKey}`).join("\n");
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Prepare FormData for the server
    const formData = new FormData();
    formData.append('file', blob, 'experiment_results_difficult.csv');

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
        link.setAttribute("download", "experiment_results_difficult.csv");
        document.body.appendChild(link);
        link.click();
    });
}

document.addEventListener('keydown', (event) => {
    if (!isExperimentDifficultRunning) return;

    const key = event.key;
    const reactionTime = new Date().getTime() - taskStartTimeDifficult;
    let correct = false;

    if (currentTaskDifficult.type === 'shape') {
        if ((currentTaskDifficult.shape === 'circle' && key === 'b') ||
            (currentTaskDifficult.shape === 'rectangle' && key === 'n') ||
            (currentTaskDifficult.shape === 'triangle' && key === 'v') ||
            (currentTaskDifficult.shape === 'star' && key === 'm')) {
            correct = true;
        }
    } else if (currentTaskDifficult.type === 'color') {
        if ((currentTaskDifficult.color === 'yellow' && key === 'b') ||
            (currentTaskDifficult.color === 'blue' && key === 'n') ||
            (currentTaskDifficult.color === 'green' && key === 'v') ||
            (currentTaskDifficult.color === 'red' && key === 'm')) {
            correct = true;
        }
    }

    recordResultDifficult(currentTaskDifficult, reactionTime, correct, key);

    if (correct) {
        displayStimulusDifficult();
    } else {
        alert('Incorrect! Please press the correct key.');
        clearScreenDifficult();
        setTimeout(displayStimulusDifficult, 2000);
    }
});

function clearScreenDifficult() {
    document.getElementById('shape-task-experiment-difficult').innerHTML = '';
    document.getElementById('color-task-experiment-difficult').innerHTML = '';
    document.getElementById('left-part-experiment-difficult').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-difficult').style.visibility = 'hidden';
}

document.getElementById('start-experiment-difficult-button').addEventListener('click', startExperimentDifficult);
