export class PID {
    output = {
        min: -1000,
        max: 1000,
    }
    previousError = 0;
    proportional = 0;
    integral = 0;
    derivative = 0;
    constructor(target, kP, kI, kD, time) {
        this.target = target;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.time = time / 1000; // in seconds
        console.log(this);
    }

    reset(target, kP, kI, kD, time) {
        this.target = target;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.time = time / 1000; // in seconds
        this.previousError = 0;
        this.proportional = 0;
        this.integral = 0;
        this.derivative = 0;
    }

    changeSetPoint(target) {
        this.target = target;
    }

    run(pv) {
        let error = this.target - pv;

        this.proportional = this.kP * error;
        this.integral += this.kI * error * this.time;
        this.derivative = this.kD * (error - this.previousError) / this.time;

        this.previousError = error;

        let output = this.proportional + this.integral + this.derivative;
        console.log(pv);
        console.log(error, this.proportional, this.integral, this.derivative, output)


        if (output > this.output.max) {
            output = this.output.max;
        } else if (output < this.output.min) {
            output = this.output.min;
        }
        return output;
    }

    getSetPoint() {
        return this.target;
    }

    getProportional() {
        return this.proportional;
    }

    getIntegral() {
        return this.integral;
    }

    getDerivative() {
        return this.derivative;
    }
}
