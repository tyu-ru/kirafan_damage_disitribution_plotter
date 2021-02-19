'use strict';
window.onload = () => {

    let x = [];
    let y = [];
    for (let i = 0; i < 100; ++i) {
        x.push(i / 5);
        y.push(Math.sin(i / 5));

        let data = { x: x, y: y, type: "line", name: "sin(x)" };

        Plotly.newPlot('chart-area', [data]);
    }
};