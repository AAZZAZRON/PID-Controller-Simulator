import Chart from 'chart.js/auto';

const graph = document.getElementById('graph');
const POINTS = 50; // number of points to show on graph
var numPoints = 0; // tmp not required

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
function generateData() { // for testing
    // generate number from 1-50
    return {
        setPoint: Math.floor(Math.random() * 50) + 1,
        proportional: Math.floor(Math.random() * 50) + 1,
        integral: Math.floor(Math.random() * 50) + 1,
        derivative: Math.floor(Math.random() * 50) + 1,
        time: ++numPoints,
    }
}


const data = {
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
        },
        {
            label: 'Integral',
            id: 'integral',
            // data: PIDdata.map(row => row.integral)
        },
        {
            label: 'Derivative',
            id: 'derivative',
            // data: PIDdata.map(row => row.derivative)
        },
        {
            label: 'Motor',
            id: 'motor',
            // data: PIDdata.map(row => row.motor)
        },
    ]
};


const config = {
    type: 'line',
    data: data,
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

const chart = new Chart(
    graph, 
    config,
);



export default function addData(data) {
    // data = generateData();
    chart.data.labels.push(data.time);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data[dataset.id]);
    });
    
    if (chart.data.labels.length >= POINTS) {
        shiftRight();
    }

    chart.update('none');
}

function shiftRight() {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update('none');
}

document.getElementById('add').addEventListener('click', () => {
    addData(generateData());
});


