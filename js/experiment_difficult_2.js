let taskCounterDifficult2 = 0;
const maxTasksDifficult2 = 50;
let currentTaskDifficult2 = '';
let taskStartTimeDifficult2 = 0;
const resultsDifficult2 = [];
let lastTaskDifficult2 = '';
let isExperimentRunningDifficult2 = false;

function startExperimentDifficult2() {
    if (isExperimentRunningDifficult2) return;
    isExperimentRunningDifficult2 = true;

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area-difficult-2').style.display = 'flex';
    displayStimulusDifficult2();
    setTimeout(showBothPartsDifficult, 2000);
}

function displayStimulusDifficult2() {
    if (taskCounterDifficult2 >= maxTasksDifficult2) {
        alert("Experiment Completed!");
        hideExperimentScreenDifficult2();
        downloadResultsDifficult2();
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task-experiment-difficult-2');
    const colorTaskElement = document.getElementById('color-task-experiment-difficult-2');
    const leftPart = document.getElementById('left-part-experiment-difficult-2');
    const rightPart = document.getElementById('right-part-experiment-difficult-2');
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
        const randomShape1 = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        let randomShape2;
        let randomColor2;

        do {
            randomShape2 = shapes[Math.floor(Math.random() * shapes.length)];
        } while (randomShape2 === randomShape1);

        do {
            randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        } while (randomColor2 === randomColor1);

        if (isShapeTask) {
            shapeTaskElement.innerHTML = getShapeHtml(randomShape1, randomColor1) + getShapeHtml(randomShape2, randomColor2);
            leftPart.style.visibility = 'visible';
            rightPart.style.visibility = 'hidden';
            newTask = {
                type: 'shape',
                shape1: randomShape1,
                color1: randomColor1,
                shape2: randomShape2,
                color2: randomColor2
            };
        } else {
            colorTaskElement.innerHTML = getShapeHtml(randomShape1, randomColor1) + getShapeHtml(randomShape2, randomColor2);
            rightPart.style.visibility = 'visible';
            leftPart.style.visibility = 'hidden';
            newTask = {
                type: 'color',
                color1: randomColor1,
                color2: randomColor2
            };
        }
    } while (newTask.shape1 === lastTaskDifficult2.shape1 && newTask.color1 === lastTaskDifficult2.color1 && newTask.shape2 === lastTaskDifficult2.shape2 && newTask.color2 === lastTaskDifficult2.color2 && newTask.type === lastTaskDifficult2.type);

    currentTaskDifficult2 = newTask;
    lastTaskDifficult2 = newTask;
    taskStartTimeDifficult2 = new Date().getTime();
    taskCounterDifficult2++;
}

function getShapeHtml(shape, color) {
    if (shape === 'triangle') {
        return `<div class="shape-${shape}" style="border-bottom-color:${color};"></div>`;
    } else if (shape === 'star') {
        return `<div class="shape-${shape}" style="color:${color};"></div>`;
    } else {
        return `<div class="shape-${shape}" style="background-color:${color};"></div>`;
    }
}

function hideExperimentScreenDifficult2() {
    document.getElementById('experiment-area-difficult-2').style.display = 'none';
    document.getElementById('left-part-experiment-difficult-2').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-difficult-2').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounterDifficult2 = 0;
    isExperimentRunningDifficult2 = false;
}

function recordResultDifficult2(task, reactionTime, correct) {
    resultsDifficult2.push({
        blockname: task.type + ' task',
        detailedTask: `${task.color1} ${task.shape1 || 'circle'} and ${task.color2} ${task.shape2 || 'circle'}`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong'
    });
}

function downloadResultsDifficult2() {
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = resultsDifficult2.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Prepare FormData for the server
    const formData = new FormData();
    formData.append('file', blob, 'experiment_results_difficult_2.csv');

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
        link.setAttribute("download", "experiment_results_difficult_2.csv");
        document.body.appendChild(link);
        link.click();
    });
}

document.addEventListener('keydown', (event) => {
    if (!isExperimentRunningDifficult2) return;

    const key = event.key;
    const reactionTime = new Date().getTime() - taskStartTimeDifficult2;
    let correct = false;

    if (currentTaskDifficult2.type === 'shape') {
        if ((currentTaskDifficult2.shape1 === 'circle' && key === 'b') ||
            (currentTaskDifficult2.shape1 === 'rectangle' && key === 'n') ||
            (currentTaskDifficult2.shape1 === 'triangle' && key === 'v') ||
            (currentTaskDifficult2.shape1 === 'star' && key === 'm')) {
            correct = true;
        }
    } else if (currentTaskDifficult2.type === 'color') {
        if ((currentTaskDifficult2.color1 === 'yellow' && key === 'b') ||
            (currentTaskDifficult2.color1 === 'blue' && key === 'n') ||
            (currentTaskDifficult2.color1 === 'green' && key === 'v') ||
            (currentTaskDifficult2.color1 === 'red' && key === 'm')) {
            correct = true;
        }
    }

    recordResultDifficult2(currentTaskDifficult2, reactionTime, correct);

    if (correct) {
        displayStimulusDifficult2();
    } else {
        alert('Incorrect! Please press the correct key.');
        clearScreenDifficult2();
        setTimeout(displayStimulusDifficult2, 2000);
    }
});

function clearScreenDifficult2() {
    document.getElementById('shape-task-experiment-difficult-2').innerHTML = '';
    document.getElementById('color-task-experiment-difficult-2').innerHTML = '';
    document.getElementById('left-part-experiment-difficult-2').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-difficult-2').style.visibility = 'hidden';
}

document.getElementById('start-experiment-difficult-button-2').addEventListener('click', startExperimentDifficult2);
