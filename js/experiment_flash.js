let taskCounterFlash = 0;
const maxTasksFlash = 50;
let currentTaskFlash = '';
let taskStartTimeFlash = 0;
const resultsFlash = [];
let lastTaskFlash = '';
let isExperimentRunningFlash = false;

const imagesPath = 'E:/万昊南高中/元培学者计划/taskswitching_html/pictures/';
const imageFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg'];

function startExperimentFlash() {
    if (isExperimentRunningFlash) return;
    isExperimentRunningFlash = true;

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area-flash').style.display = 'flex';

    // Show the instructions for 2 seconds before starting the task
    setTimeout(displayStimulusFlash, 2000);
}

function displayStimulusFlash() {
    if (taskCounterFlash >= maxTasksFlash) {
        alert("Experiment Completed!");
        hideExperimentScreenFlash();
        downloadResultsFlash();
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task-experiment-flash');
    const colorTaskElement = document.getElementById('color-task-experiment-flash');
    const flashAreaElement = document.getElementById('flash-area');
    const leftPart = document.getElementById('left-part-experiment-flash');
    const rightPart = document.getElementById('right-part-experiment-flash');
    const shapes = ['circle', 'rectangle'];
    const colors = ['yellow', 'blue'];

    let isShapeTask = Math.random() < 0.5;
    let newTask;

    // Clear previous task
    shapeTaskElement.innerHTML = '';
    colorTaskElement.innerHTML = '';
    flashAreaElement.innerHTML = '';
    leftPart.style.visibility = 'hidden';
    rightPart.style.visibility = 'hidden';

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
    } while (newTask.shape === lastTaskFlash.shape && newTask.color === lastTaskFlash.color && newTask.type === lastTaskFlash.type);
    
    currentTaskFlash = newTask;
    lastTaskFlash = newTask;
    taskStartTimeFlash = new Date().getTime();
    taskCounterFlash++;
}

function hideExperimentScreenFlash() {
    document.getElementById('experiment-area-flash').style.display = 'none';
    document.getElementById('left-part-experiment-flash').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-flash').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounterFlash = 0;
    isExperimentRunningFlash = false;
}

function recordResultFlash(task, reactionTime, correct) {
    resultsFlash.push({
        blockname: task.type + ' task',
        detailedTask: `${task.color} ${task.shape || 'circle'}`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong'
    });
}

function downloadResultsFlash() {
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = resultsFlash.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Prepare FormData for the server
    const formData = new FormData();
    formData.append('file', blob, 'experiment_results_flash.csv');

    // Send the CSV file to the server
    fetch('http://121.40.133.54:3000/save-results', {
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
        link.setAttribute("download", "experiment_results_flash.csv");
        document.body.appendChild(link);
        link.click();
    });
}

document.addEventListener('keydown', (event) => {
    if (!isExperimentRunningFlash) return;

    const key = event.key;
    const reactionTime = new Date().getTime() - taskStartTimeFlash;
    let correct = false;

    if (currentTaskFlash.type === 'shape') {
        if ((currentTaskFlash.shape === 'circle' && key === 'b') || 
            (currentTaskFlash.shape === 'rectangle' && key === 'n')) {
            correct = true;
        }
    } else if (currentTaskFlash.type === 'color') {
        if ((currentTaskFlash.color === 'yellow' && key === 'b') || 
            (currentTaskFlash.color === 'blue' && key === 'n')) {
            correct = true;
        }
    }

    recordResultFlash(currentTaskFlash, reactionTime, correct);

    // Inside the keydown event listener where correct === true
    if (correct) {
    // Randomly decide whether to flash an image
    if (Math.random() < 0.5) {
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const flashAreaElement = document.getElementById('flash-area');
        flashAreaElement.innerHTML = `<img src="${imagesPath}${randomImage}" alt="Flashing Image" style="width: 200px; height: 200px;">`;
        setTimeout(() => {
            flashAreaElement.innerHTML = '';
        }, 500); // Flash the image for 0.5 seconds (500 milliseconds)
    }
    displayStimulusFlash();
}

});

function clearScreenFlash() {
    document.getElementById('shape-task-experiment-flash').innerHTML = '';
    document.getElementById('color-task-experiment-flash').innerHTML = '';
    document.getElementById('left-part-experiment-flash').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-flash').style.visibility = 'hidden';
}

document.getElementById('start-experiment-flash-button').addEventListener('click', startExperimentFlash);
