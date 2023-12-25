import addData from './PIDgraph.js';
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

function start(kP, kI, kD) {
    pid.reset(Number(setPoint.value), kP, kI, kD, TIME_INTERVAL);
    let time = 0;

    let motor = 0; // current motor speed

    addData({
        setPoint: pid.getSetPoint(),
        proportional: pid.getProportional(),
        integral: pid.getIntegral(),
        derivative: pid.getDerivative(),
        motor: motor,
        time: time,
    });

    let interval = setInterval(() => {

        change = pid.run(motor);
        motor += change;

        addData({
            setPoint: pid.getSetPoint(),
            proportional: pid.getProportional(),
            integral: pid.getIntegral(),
            derivative: pid.getDerivative(),
            motor: motor,
            time: time,
        });

        time += TIME_INTERVAL;
    }, TIME_INTERVAL);

    
}
