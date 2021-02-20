'use strict';

document.write('<script src="fft.js"></script>');

window.onload = () => {
    document.getElementById("damage-division").oninput = solve;
    connect_slider_and_number("probability");
    connect_slider_and_number("damage-change");

    document.getElementById("damage-sample-min").oninput = damage_sample_clamp;
    document.getElementById("damage-sample-max").oninput = damage_sample_clamp;
    document.getElementById("damage").oninput = damage_sample_clamp;
    document.getElementById("damage-type").onchange = damage_sample_clamp;

    document.getElementById("Plotly-static-mode").onchange = render;

    document.getElementById("damage-sample-min-pick").onclick = () => {
        pick_target = document.getElementById("damage-sample-min");
        render();
    };
    document.getElementById("damage-sample-max-pick").onclick = () => {
        pick_target = document.getElementById("damage-sample-max");
        render();
    };
    solve();
};

function connect_slider_and_number(id) {
    let slider = document.getElementById(id + "_slider");
    let number = document.getElementById(id + "_number")
    slider.oninput = () => { number.value = slider.value; solve(); };
    number.oninput = () => { slider.value = number.value; solve(); };
}

function damage_sample_clamp() {
    let min = document.getElementById("damage-sample-min");
    let max = document.getElementById("damage-sample-max");
    let damage = document.getElementById("damage").value * 3.5;
    min.value = Math.min(min.value, damage);
    max.value = Math.min(max.value, damage);
    render();
}

var pick_target = null;
function register_pick_event() {
    document.getElementById("chart-area").on("plotly_click", e => {
        if (pick_target) {
            pick_target.value = Math.round(e.points[0].x * 10) / 10;
            render();
            pick_target = null;
        }
    });
}

function get_param() {
    const damage_division = division_array_from_string(document.getElementById("damage-division").value);
    const critical_probability = document.getElementById("probability_number").value / 100;
    const damage_change = document.getElementById("damage-change_number").value;
    const critical_coefficient = 1.5 * (1 + damage_change / 100);
    const max_coeffient = 3;
    const x_division = 1000;
    const data_len = x_division * max_coeffient;
    const damage_factor = document.getElementById("damage").value / document.getElementById("damage-type").value;
    const damage_sample_min = document.getElementById("damage-sample-min").value;
    const damage_sample_max = document.getElementById("damage-sample-max").value;
    return {
        damage_division,
        critical_probability,
        damage_change,
        critical_coefficient,
        max_coeffient,
        x_division,
        data_len,
        damage_factor,
        damage_sample_min,
        damage_sample_max,
    };
}

let distribution;
let cumsum;
function solve() {
    const param = get_param();

    cumsum = Array(param.data_len + 1).fill(0);
    let st = performance.now();
    distribution = fft_convolution(param.x_division, param.data_len, param.damage_division, param.critical_probability, param.critical_coefficient);
    for (let i = 0; i < param.data_len; ++i) {
        cumsum[i + 1] = cumsum[i] + distribution[i];
    }
    let en = performance.now();
    console.log("fft_convolution:" + (en - st) + "ms");
    render();
}

function render() {
    const param = get_param();
    const static_mode = document.getElementById("Plotly-static-mode").checked;

    let x = Array(param.data_len).fill().map((_, i) => i / param.x_division * param.damage_factor);
    let data = [];
    data.push({
        x: x,
        y: distribution.map(e => e * param.x_division / param.damage_factor),
        type: "line",
        name: "fft_convolution",
        fill: "tozeroy",
    });

    let layout = {
        title: 'Damage Dsitribution',
        showlegend: false,
        yaxis: { title: "Damage", fixedrange: true },
        xaxis: {
            title: "Probability Density",
            fixedrange: static_mode,
            dtick: 0.1 * param.damage_factor,
            range: [0, (param.critical_coefficient + 0.05) * param.damage_factor]
        },
        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: 'paper',
                x0: param.damage_sample_min,
                x1: param.damage_sample_max,
                y0: 0,
                y1: 1,
                fillcolor: "#d3d3d3",
                opacity: 0.2,
                line: {
                    width: 0
                }
            },
            {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: param.damage_sample_min,
                x1: param.damage_sample_min,
                y0: 0,
                y1: 1,
                line: {
                    color: "#ff0000",
                    width: 1,
                }
            },
            {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: param.damage_sample_max,
                x1: param.damage_sample_max,
                y0: 0,
                y1: 1,
                line: {
                    color: "#ff0000",
                    width: 1,
                }
            }
        ]
    };
    Plotly.newPlot('chart-area', data, layout, { responsive: true });

    let min_index = Math.min(Math.floor(param.damage_sample_min * param.x_division / param.damage_factor), param.data_len);
    let max_index = Math.min(Math.floor(param.damage_sample_max * param.x_division / param.damage_factor), param.data_len);
    let range_integral = cumsum[max_index] - cumsum[min_index];
    document.getElementById("probability").textContent = Math.floor(range_integral * 1000) / 10;
    register_pick_event();
}

function division_array_from_string(str) {
    let res = str.split(/\D+/).map(e => parseInt(e)).filter(e => !isNaN(e));
    let sum = res.reduce((s, x) => s + x, 0);
    return res.map(e => e / sum);
}

function montecarlo(x_division, data_len, damage_division, critical_probability, critical_coefficient) {
    let p = Array(data_len).fill(0);
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

function once_distribution(x_division, data_len, damage, critical_probability, critical_coefficient) {
    let p = Array(data_len).fill(0);
    for (let i = 0; i < data_len; ++i) {
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

function convolution(x_division, data_len, damage_division, critical_probability, critical_coefficient) {
    let p = Array(data_len).fill(0);
    p[0] = 1;
    for (let damage of damage_division) {
        let p2 = once_distribution(x_division, data_len, damage, critical_probability, critical_coefficient);

        let p3 = Array(data_len).fill(0);
        for (let i = 0; i < data_len; ++i) {
            for (let j = 0; j < data_len; ++j) {
                if (i + j >= data_len) break;
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

function fft_convolution(x_division, data_len, damage_division, critical_probability, critical_coefficient) {
    const n = next_power_of_two(data_len);
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
    return p.slice(0, data_len);
}