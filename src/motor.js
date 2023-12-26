export class Motor {
    constructor(TIME_INTERVAL) {
        this.TIME_INTERVAL = TIME_INTERVAL;
        this.speed = 0;
        this.maxSpeed = 100 * TIME_INTERVAL / 1000;
    }

    reset() {
        this.speed = 0;
    }

    applyChange(change) {
        if (change > this.maxSpeed) {
            change = this.maxSpeed;
        } else if (change < -this.maxSpeed) {
            change = -this.maxSpeed;
        }
        this.speed += change;
        this.speed += this.gaussianNoise(0, 1);
    }

    gaussianNoise(mean, stdDev) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return mean + (Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)) * stdDev;
    }
}
