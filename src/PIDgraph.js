import Chart from 'chart.js/auto';


export class PIDGraph {
    constructor() {
        this.graph = document.getElementById('graph');
        this.POINTS = 50; // number of points to show on graph
        this.numPoints = 0; // tmp not required   

        this.data = {
            labels: [],
            datasets: [
                {
                    label: 'Set Point',
                    id: 'setPoint',
                    // data: PIDdata.map(row => row.setPoint),
                    stepped: true,
                },
                {
                    label: 'Proportional',
                    id: 'proportional',
                    // data: PIDdata.map(row => row.proportional)
                    tension: 0.5,
                },
                {
                    label: 'Integral',
                    id: 'integral',
                    // data: PIDdata.map(row => row.integral)
                    tension: 0.5,
                },
                {
                    label: 'Derivative',
                    id: 'derivative',
                    // data: PIDdata.map(row => row.derivative)
                    tension: 0.5,
                },
                {
                    label: 'Motor',
                    id: 'motor',
                    // data: PIDdata.map(row => row.motor)
                    tension: 0.5,
                },
            ]
        };

        this.config = {
            type: 'line',
            data: this.data,
            options: {
                responsive: true,
                events: [],
                scales: {
                    x: {
                        // display: false
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'PID Controller Graph'
                    }
                }
            }
        }

        this.init();
    }

    /*
        Data format:
        {
            setPoint: 15,
            proportional: 15,
            integral: 15,
            derivative: 15,
            time: 2,
        }
    */
    generateData() { // for testing
        // generate number from 1-50
        return {
            setPoint: Math.floor(Math.random() * 50) + 1,
            proportional: Math.floor(Math.random() * 50) + 1,
            integral: Math.floor(Math.random() * 50) + 1,
            derivative: Math.floor(Math.random() * 50) + 1,
            time: ++this.numPoints,
        }
    }

    init() {
        this.chart = new Chart(
            this.graph, 
            this.config,
        );
    }


    reset() { // create new graph
        this.chart.data.labels = [];
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        this.chart.update('none');
    }



    addData(data) {
        // data = generateData();
        this.chart.data.labels.push(data.time);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data[dataset.id]);
        });
        
        if (this.chart.data.labels.length > this.POINTS) {
            this.shiftRight();
        }

        this.chart.update('none');
    }

    shiftRight() {
        this.chart.data.labels.shift();
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
        this.chart.update('none');
    }
}
