let taskCounter = 0;
const maxTasks = 50; // Change the loop to 50 iterations
let currentTask = ''; // Keep track of the current task type
let taskStartTime = 0; // Track task start time for reaction time measurement
const results = [];
let lastTask = '';
let isExperimentRunning = false; // Flag to indicate if the experiment is running

function startExperiment() {
    if (isExperimentRunning) return; // Prevent starting the experiment if it's already running
    isExperimentRunning = true; // Set the flag to indicate the experiment is running

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area').style.display = 'flex';
    showBothParts();
}

function showBothParts() {
    const leftPart = document.getElementById('left-part-experiment');
    const rightPart = document.getElementById('right-part-experiment');

    leftPart.style.visibility = 'visible';
    rightPart.style.visibility = 'visible';

    // Start the experiment after 2 seconds
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

    // Randomly choose the task
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
    taskCounter = 0;  // Reset the task counter for the next experiment
    isExperimentRunning = false; // Reset the flag when hiding the experiment screen
}

function recordResult(task, reactionTime, correct) {
    results.push({
        blockname: task.type + ' task',
        detailedTask: `${task.color} ${task.shape}`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong'
    });
}

// Adjustments in your existing client-side JavaScript
function downloadResults() {
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    fetch('http://121.40.133.54:3000/save-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(results)
    })
    .then(response => {
        if (response.ok) {
            alert('Results saved successfully on the server');

            const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "experiment_results.csv");
            document.body.appendChild(link);
            link.click();
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while saving results: ' + error.message);
    });
}



document.addEventListener('keydown', (event) => {
    if (!isExperimentRunning) return; // Ignore key events if the experiment is not running

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

document.getElementById('start-experiment-button').addEventListener('click', () => {
    if (!isSampleRunning) { // Start the experiment only if the sample is not running
        startExperiment();
    } else {
        alert("Finish the sample task before starting the experiment.");
    }
});
