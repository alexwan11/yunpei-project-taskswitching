let taskCounterDifficult = 0;
const maxTasksDifficult = 50;
let currentTaskDifficult = '';
let taskStartTimeDifficult = 0;
let lastTaskDifficult = '';
let isExperimentDifficultRunning = false;

function startExperimentDifficult() {
    if (isExperimentDifficultRunning) return;
    isExperimentDifficultRunning = true;

    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('experiment-area-difficult').style.display = 'flex';
    showBothPartsDifficult();
}

function showBothPartsDifficult() {
    const leftPart = document.getElementById('left-part-experiment-difficult');
    const rightPart = document.getElementById('right-part-experiment-difficult');

    leftPart.style.visibility = 'visible';
    rightPart.style.visibility = 'visible';

    setTimeout(displayStimulusDifficult, 2000);
}

function displayStimulusDifficult() {
    if (taskCounterDifficult >= maxTasksDifficult) {
        alert("Experiment Completed!");
        hideExperimentDifficultScreen();
        downloadResults();
        return;
    }

    const shapeTaskElement = document.getElementById('shape-task-experiment-difficult');
    const colorTaskElement = document.getElementById('color-task-experiment-difficult');
    const leftPart = document.getElementById('left-part-experiment-difficult');
    const rightPart = document.getElementById('right-part-experiment-difficult');
    const shapes = ['circle', 'rectangle'];
    const combinedShapes = ['circle-in-square', 'square-in-circle'];
    const colors = ['yellow', 'blue'];

    let isShapeTask = Math.random() < 0.5;
    let newTask;

    do {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const combinedShape = combinedShapes[Math.floor(Math.random() * combinedShapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const innerColor = colors[Math.floor(Math.random() * colors.length)];

        if (isShapeTask) {
            const shapeClass = Math.random() < 0.7 ? combinedShape : randomShape; // 70% chance for combined shapes
            shapeTaskElement.innerHTML = shapeClass.includes('in') ?
                `<div class="shape-${shapeClass}" style="background-color:${randomColor}"><div class="inner-shape" style="background-color:${innerColor}"></div></div>` :
                `<div class="shape-${shapeClass}" style="background-color:${randomColor}"></div>`;
            leftPart.style.visibility = 'visible';
            rightPart.style.visibility = 'hidden';
            newTask = { type: 'shape', shape: shapeClass, outerColor: randomColor, innerColor: innerColor };
        } else {
            const shapeClass = Math.random() < 0.7 ? combinedShape : randomShape; // 70% chance for combined shapes
            colorTaskElement.innerHTML = shapeClass.includes('in') ?
                `<div class="shape-${shapeClass}" style="background-color:${randomColor}"><div class="inner-shape" style="background-color:${innerColor}"></div></div>` :
                `<div class="shape-${shapeClass}" style="background-color:${randomColor}"></div>`;
            leftPart.style.visibility = 'hidden';
            rightPart.style.visibility = 'visible';
            newTask = { type: 'color', shape: shapeClass, outerColor: randomColor, innerColor: innerColor };
        }
    } while (newTask.shape === lastTaskDifficult.shape && newTask.innerColor === lastTaskDifficult.innerColor && newTask.outerColor === lastTaskDifficult.outerColor && newTask.type === lastTaskDifficult.type);

    currentTaskDifficult = newTask;
    lastTaskDifficult = newTask;
    taskStartTimeDifficult = new Date().getTime();
    taskCounterDifficult++;
}

function hideExperimentDifficultScreen() {
    document.getElementById('experiment-area-difficult').style.display = 'none';
    document.getElementById('left-part-experiment-difficult').style.visibility = 'hidden';
    document.getElementById('right-part-experiment-difficult').style.visibility = 'hidden';
    document.querySelector('.instructions').style.display = 'block';
    taskCounterDifficult = 0;
    isExperimentDifficultRunning = false;
}

function recordResultDifficult(task, reactionTime, correct) {
    results.push({
        blockname: task.type + ' task',
        detailedTask: `${task.outerColor} ${task.shape} with ${task.innerColor} inner`,
        reactionTime: `${reactionTime}ms`,
        rw: correct ? 'right' : 'wrong'
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
            (currentTaskDifficult.shape === 'circle-in-square' && key === 'n') ||
            (currentTaskDifficult.shape === 'square-in-circle' && key === 'b')) {
            correct = true;
        }
    } else if (currentTaskDifficult.type === 'color') {
        if (currentTaskDifficult.shape.includes('circle-in-square')) {
            if ((currentTaskDifficult.innerColor === 'yellow' && key === 'b') ||
                (currentTaskDifficult.innerColor === 'blue' && key === 'n')) {
                correct = true;
            }
        } else if (currentTaskDifficult.shape.includes('square-in-circle')) {
            if ((currentTaskDifficult.innerColor === 'yellow' && key === 'b') ||
                (currentTaskDifficult.innerColor === 'blue' && key === 'n')) {
                correct = true;
            }
        } else {
            if ((currentTaskDifficult.outerColor === 'yellow' && key === 'b') ||
                (currentTaskDifficult.outerColor === 'blue' && key === 'n')) {
                correct = true;
            }
        }
    }

    recordResultDifficult(currentTaskDifficult, reactionTime, correct);

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

function download_difficult_Results() {
    const csvHeader = "blockname,detailed task,reaction time,rw\n";
    const csvContent = results.map(e => `${e.blockname},${e.detailedTask},${e.reactionTime},${e.rw}`).join("\n");
    const csvData = csvHeader + csvContent;

    fetch('http://121.40.133.54/save-results', {
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
