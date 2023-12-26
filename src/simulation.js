import { PIDGraph } from './PIDgraph.js';
import { PID } from './PID.js';
import { Motor } from './motor.js';

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
const motor = new Motor(TIME_INTERVAL);
var isSimulating = 0;


startButton.addEventListener('click', () => {
    startButton.disabled = true;
    changeButton.disabled = false;
    stopButton.disabled = false;
    setPoint.disabled = false;
    // kPInput.disabled = true;
    // kIInput.disabled = true;
    // kDInput.disabled = true;
    startSimulation();
});

stopButton.addEventListener('click', () => {
    startButton.disabled = false;
    changeButton.disabled = true;
    stopButton.disabled = true;
    setPoint.disabled = true;
    kPInput.disabled = false;
    kIInput.disabled = false;
    kDInput.disabled = false;
    // stop();
});

changeButton.addEventListener('click', () => {
    pid.changeSetPoint(Number(setPoint.value));
});

document.getElementById('add').addEventListener('click', () => {
    graph.addData(graph.generateData());
});

function startSimulation() {
    isSimulating = 1;
    pid.reset(Number(setPoint.value), Number(kPInput.value), Number(kIInput.value), Number(kDInput.value), TIME_INTERVAL);
    graph.reset();
    motor.reset();

    console.log(graph);

    let time = 0;

    graph.addData({ // initial point
        setPoint: 0,
        proportional: pid.getProportional(),
        integral: pid.getIntegral(),
        derivative: pid.getDerivative(),
        motor: motor.speed,
        time: time,
    });

    let interval = setInterval(() => {

        let change = pid.run(motor.speed);
        motor.applyChange(change);

        graph.addData({
            setPoint: pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor.speed,
            time: time,
        });

        time += TIME_INTERVAL;
    }, TIME_INTERVAL);

    document.getElementById('stop').addEventListener('click', () => {
        clearInterval(interval);
        isSimulating = 0;
    });
}

kPInput.addEventListener('change', () => {
    if (isSimulating) pid.setKP(Number(kPInput.value));
    else updateGraph();
});
kIInput.addEventListener('change', () => {
    if (isSimulating) pid.setKI(Number(kIInput.value));
    else updateGraph();
});
kDInput.addEventListener('change', () => {
    if (isSimulating) pid.setKD(Number(kDInput.value));
    else updateGraph();
});


function updateGraph() {
    console.log("update");
    pid.reset(Number(setPoint.value), Number(kPInput.value), Number(kIInput.value), Number(kDInput.value), TIME_INTERVAL);
    graph.reset();
    motor.reset();

    for (let time = 0; time < graph.POINTS; time++) {
        graph.addData({
            setPoint: time < 1 ? 0 : pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor.speed,
            time: time,
        });

        let change = pid.run(motor.speed);
        motor.applyChange(change);
    }
    console.log(graph);
}
