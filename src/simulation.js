import {PIDGraph} from './PIDgraph.js';
import {PID} from './PID.js';

// init
const startButton = document.getElementById('start');
const changeButton = document.getElementById('change');
const stopButton = document.getElementById('stop');
const setPoint = document.getElementById('setpoint');
const kPInput = document.getElementById('kp');
const kIInput = document.getElementById('ki');
const kDInput = document.getElementById('kd');

const TIME_INTERVAL = 1000; // in ms
const pid = new PID(0, 0, 0, 0, TIME_INTERVAL);
const graph = new PIDGraph();

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    changeButton.disabled = false;
    stopButton.disabled = false;
    setPoint.disabled = false;
    // kPInput.disabled = true;
    // kIInput.disabled = true;
    // kDInput.disabled = true;
    start(Number(kPInput.value), Number(kIInput.value), Number(kDInput.value));
});

stopButton.addEventListener('click', () => {
    startButton.disabled = false;
    changeButton.disabled = true;
    stopButton.disabled = true;
    setPoint.disabled = true;
    kPInput.disabled = false;
    kIInput.disabled = false;
    kDInput.disabled = false;
    stop();
});

changeButton.addEventListener('click', () => {
    pid.changeSetPoint(Number(setPoint.value));
});

document.getElementById('add').addEventListener('click', () => {
    graph.addData(graph.generateData());
});

function gaussianNoise(mean, stdDev) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return mean + (Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)) * stdDev;
}

function start(kP, kI, kD) {
    pid.reset(Number(setPoint.value), kP, kI, kD, TIME_INTERVAL);
    graph.reset();
    console.log(graph);
    let time = 0;

    let motor = 0; // current motor speed

    graph.addData({
        setPoint: pid.getSetPoint(),
        proportional: pid.getProportional(),
        integral: pid.getIntegral(),
        derivative: pid.getDerivative(),
        motor: motor,
        time: time,
    });

    let interval = setInterval(() => {

        let change = pid.run(motor);
        // noise be a random number from -5 to 5
        motor += change + gaussianNoise(0, 1);

        graph.addData({
            setPoint: pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor,
            time: time,
        });

        time += TIME_INTERVAL;
    }, TIME_INTERVAL);

    document.getElementById('stop').addEventListener('click', () => {
        clearInterval(interval);
    });
}

kPInput.addEventListener('change', () => {
    updateGraph();
});
kIInput.addEventListener('change', () => {
    updateGraph();
});
kDInput.addEventListener('change', () => {
    updateGraph();
});

// kPInput.addEventListener('change', () => {
//     pid.setKP(Number(kPInput.value));
// });
// kIInput.addEventListener('change', () => {
//     pid.setKI(Number(kIInput.value));
// });
// kDInput.addEventListener('change', () => {
//     pid.setKD(Number(kDInput.value));
// });

function updateGraph() {
    console.log("update");
    pid.reset(Number(setPoint.value), Number(kPInput.value), Number(kIInput.value), Number(kDInput.value), TIME_INTERVAL);
    graph.reset();
    let motor = 0;

    for (let time = 0; time < graph.POINTS; time++) {
        graph.addData({
            setPoint: time < 1 ? 0 : pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor,
            time: time,
        });
        console.log({
            setPoint: time < 1 ? 0 : pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor,
            time: time,
        });

        let change = pid.run(motor);
        motor += change + gaussianNoise(0, 1);
    }
    console.log(graph);
}