'use strict';

document.write('<script src="fft.js"></script>');

window.onload = () => {
    document.getElementById("damage-division").oninput = render;
    connect_slider_and_number("probability");
    connect_slider_and_number("damage-change");

    document.getElementById("damage-sample-min-pick").onclick = () => { hoge = document.getElementById("damage-sample-min") };
    document.getElementById("damage-sample-max-pick").onclick = () => { hoge = document.getElementById("damage-sample-max") };
    render();
};

function connect_slider_and_number(id) {
    let slider = document.getElementById(id + "_slider");
    let number = document.getElementById(id + "_number")
    slider.oninput = () => { number.value = slider.value; render(); };
    number.oninput = () => { slider.value = number.value; render(); };
}

var hoge = null;
function register_pick_event() {
    document.getElementById("chart-area").on("plotly_click", e => {
        if (hoge) {
            hoge.value = Math.floor(e.points[0].x);
            render();
        }
    });
}

function render() {
    const damage_division = division_array_from_string(document.getElementById("damage-division").value);
    const critical_probability = document.getElementById("probability_number").value / 100;
    const damage_change = document.getElementById("damage-change_number").value;
    const critical_coefficient = 1.5 * (1 + damage_change / 100);

    const max_coeffient = 3;
    const x_division = 1000;
    const data_len = x_division * max_coeffient;

    const damage_factor = document.getElementById("damage").value / document.getElementById("damage-type").value;

    let damage_sample_min = document.getElementById("damage-sample-min").value;
    let damage_sample_max = document.getElementById("damage-sample-max").value;

    let x = Array(data_len).fill().map((_, i) => i / x_division * damage_factor);
    let data = [];
    let cumsum = Array(data_len + 1).fill(0);
    function add_data(fn, fil) {
        let st = performance.now();
        let y = fn(x_division, data_len, damage_division, critical_probability, critical_coefficient);
        for (let i = 0; i < data_len; ++i) {
            cumsum[i + 1] = cumsum[i] + y[i];
        }
        let en = performance.now();
        console.log(fn.name + ":" + (en - st) + "ms");
        data.push({
            x: x,
            y: y.map(e => e * x_division / damage_factor),
            type: "line",
            name: fn.name,
            fill: fil ? 'tozeroy' : "none",
        });
    }
    // add_data(montecarlo, false);
    // add_data(convolution, true);
    add_data(fft_convolution, true);
    let f = document.getElementById("Plotly-static-mode").checked;
    let layout = {
        title: 'Damage Dsitribution',
        showlegend: false,
        yaxis: { title: "Damage", fixedrange: f },
        xaxis: {
            title: "Probability Density",
            fixedrange: f,
            dtick: 0.1 * damage_factor,
            range: [0, (critical_coefficient + 0.05) * damage_factor]
        },
        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: 'paper',
                x0: damage_sample_min,
                x1: damage_sample_max,
                y0: 0,
                y1: 1,
                fillcolor: "#d3d3d3",
                opacity: 0.2,
                line: {
                    width: 0
                }
            }
        ]
    };
    Plotly.newPlot('chart-area', data, layout, { responsive: true });
    document.getElementById("probability").textContent = (cumsum[Math.floor(damage_sample_max * x_division / damage_factor)] - cumsum[Math.floor(damage_sample_min * x_division / damage_factor)]) * 100;
    register_pick_event();
}

function division_array_from_string(str) {
    let res = str.split(/\D+/).map(e => parseInt(e)).filter(e => !isNaN(e));
    let sum = res.reduce((s, x) => s + x, 0);
    return res.map(e => e / sum);
}

function montecarlo(x_division, len, damage_division, critical_probability, critical_coefficient) {
    let p = Array(len).fill(0);
    const m = 100_000;
    for (let i = 0; i < m; ++i) {
        let s = 0;
        for (let damage of damage_division) {
            s += damage * (1 - Math.random() * 0.15) * (Math.random() < critical_probability ? critical_coefficient : 1);
        }
        p[Math.floor(s * x_division)] += 1;
    }
    return p.map(e => e / m);
}

function once_distribution(x_division, len, damage, critical_probability, critical_coefficient) {
    let p = Array(len).fill(0);
    for (let i = 0; i < len; ++i) {
        let x = i / x_division;
        if (damage * 0.85 <= x && x < damage) {
            p[i] += 1 / (damage * 0.15) * (1 - critical_probability) / x_division;
        }
        if (damage * 0.85 * critical_coefficient <= x && x < damage * critical_coefficient) {
            p[i] += 1 / (damage * 0.15 * critical_coefficient) * critical_probability / x_division;
        }
    }

    let s = p.reduce((s, x) => s + x);
    return p.map(e => e / s);
}

function convolution(x_division, len, damage_division, critical_probability, critical_coefficient) {
    let p = Array(len).fill(0);
    p[0] = 1;
    for (let damage of damage_division) {
        let p2 = once_distribution(x_division, len, damage, critical_probability, critical_coefficient);

        let p3 = Array(len).fill(0);
        for (let i = 0; i < len; ++i) {
            for (let j = 0; j < len; ++j) {
                if (i + j >= len) break;
                p3[i + j] += p[i] * p2[j];
            }
        }
        p = p3;
    }
    return p;
}

function next_power_of_two(x) {
    x -= 1;
    x |= x >> 1;
    x |= x >> 2;
    x |= x >> 4;
    x |= x >> 8;
    x |= x >> 16;
    x += 1;
    return x;
}

function fft_convolution(x_division, len, damage_division, critical_probability, critical_coefficient) {
    const n = next_power_of_two(len);
    let prod_re = Array(n).fill(1);
    let prod_im = Array(n).fill(0);
    for (let damage of damage_division) {
        let re = once_distribution(x_division, n, damage, critical_probability, critical_coefficient);
        let im = Array(n).fill(0);
        FFT(re, im, n, false);
        for (let i = 0; i < n; ++i) {
            let pr = prod_re[i];
            let pi = prod_im[i];
            prod_re[i] = pr * re[i] - pi * im[i];
            prod_im[i] = pr * im[i] + pi * re[i];
        }
    }
    FFT(prod_re, prod_im, n, true);
    let p = Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
        p[i] = Math.sqrt(prod_re[i] * prod_re[i] + prod_im[i] * prod_im[i]);
    }
    return p.slice(0, len);
}