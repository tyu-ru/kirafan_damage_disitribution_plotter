'use strict';
window.onload = () => {
    render();
    connect_slider_and_number("probability");
    connect_slider_and_number("damage-change");
};

function connect_slider_and_number(id) {
    let slider = document.getElementById(id + "_slider");
    let number = document.getElementById(id + "_number")
    slider.oninput = () => { number.value = slider.value; };
    number.oninput = () => { slider.value = number.value; };
}

function render() {
    let x = Array(100).fill().map((_, i) => i);
    let y = Array(100).fill().map((_, i) => (i - 50) * (i - 50));
    let data = { x: x, y: y, type: "line", name: "sin(x)" };
    Plotly.newPlot('chart-area', [data]);
}

function division_array_from_string(str) {
    let res = str.split(/\D+/).map(e => parseInt(e)).filter(e => !isNaN(e));
    let sum = res.reduce((s, x) => s + x, 0);
    return res.map(e => e / sum);
}