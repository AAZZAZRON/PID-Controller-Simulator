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

const TIME_INTERVAL = 200; // in ms
const pid = new PID(0, 0, 0, 0, TIME_INTERVAL);
const graph = new PIDGraph();

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    changeButton.disabled = false;
    stopButton.disabled = false;
    setPoint.disabled = false;
    kPInput.disabled = true;
    kIInput.disabled = true;
    kDInput.disabled = true;
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

function start(kP, kI, kD) {
    return;
    pid.reset(Number(setPoint.value), kP, kI, kD, TIME_INTERVAL);
    graph.reset();
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
        motor += change;

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
        motor += change;
    }
    console.log(graph);
}