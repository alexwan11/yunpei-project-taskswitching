let taskCounter_sample = 0;
const maxTasks_sample = 10;
let currentTask_sample = '';
let taskStartTime_sample = 0;
let lastTask_sample = '';
let isSampleRunning = false; // Flag to indicate if the sample is running

function startSample() {
    if (isSampleRunning) return; // Prevent starting the sample if it's already running
    isSampleRunning = true; // Set the flag to indicate the sample is running

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('sample-area').style.display = 'flex';
    showBothParts_sample();
}

function showBothParts_sample() {
    const leftPart = document.getElementById('left-part');
    const rightPart = document.getElementById('right-part');

    leftPart.style.visibility = 'visible';
    rightPart.style.visibility = 'visible';

    setTimeout(displayStimulus_sample, 2000);
}

function displayStimulus_sample() {
    if (taskCounter_sample >= maxTasks_sample) {
        alert("Sample Completed! now you can do the experiment ");
        hideSampleScreen();
        isSampleRunning = false; // Reset the flag when the sample is completed
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task');
    const colorTaskElement = document.getElementById('color-task');
    const leftPart = document.getElementById('left-part');
    const rightPart = document.getElementById('right-part');
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
    } while (newTask.shape === lastTask_sample.shape && newTask.color === lastTask_sample.color && newTask.type === lastTask_sample.type);

    currentTask_sample = newTask;
    lastTask_sample = newTask;
    taskStartTime_sample = new Date().getTime();
    taskCounter_sample++;
}

function hideSampleScreen() {
    document.getElementById('sample-area').style.display = 'none';
    document.getElementById('left-part').style.visibility = 'hidden';
    document.getElementById('right-part').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounter_sample = 0;  // Reset the task counter for the next sample
    isSampleRunning = false; // Reset the flag when hiding the sample screen
}

document.addEventListener('keydown', (event) => {
    if (!isSampleRunning) return; // Ignore key events if the sample is not running

    const key = event.key;
    const reactionTime = new Date().getTime() - taskStartTime_sample;
    let correct = false;

    if (currentTask_sample.type === 'shape') {
        if ((currentTask_sample.shape === 'circle' && key === 'b') || (currentTask_sample.shape === 'rectangle' && key === 'n')) {
            correct = true;
        }
    } else if (currentTask_sample.type === 'color') {
        if ((currentTask_sample.color === 'yellow' && key === 'b') || (currentTask_sample.color === 'blue' && key === 'n')) {
            correct = true;
        }
    }

    if (!correct) {
        alert('Incorrect! Please press the correct key.');
        clearScreen_sample();
        setTimeout(displayStimulus_sample, 2000);
    } else {
        displayStimulus_sample();
    }
});

function clearScreen_sample() {
    document.getElementById('shape-task').innerHTML = '';
    document.getElementById('color-task').innerHTML = '';
    document.getElementById('left-part').style.visibility = 'hidden';
    document.getElementById('right-part').style.visibility = 'hidden';
}

document.getElementById('start-sample-button').addEventListener('click', () => {
    startSample();
});
