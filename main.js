'use strict';

document.write('<script src="fft.js"></script>');

window.onload = () => {
    document.getElementById("damage-division").oninput = render;
    connect_slider_and_number("probability");
    connect_slider_and_number("damage-change");
    render();
};

function connect_slider_and_number(id) {
    let slider = document.getElementById(id + "_slider");
    let number = document.getElementById(id + "_number")
    slider.oninput = () => { number.value = slider.value; render(); };
    number.oninput = () => { slider.value = number.value; render(); };
}

function render() {
    const damage_division = division_array_from_string(document.getElementById("damage-division").value);
    const critical_probability = document.getElementById("probability_number").value / 100;
    const damage_change = document.getElementById("damage-change_number").value;
    const critical_coefficient = 1.5 * (1 + damage_change / 100);

    const max_coeffient = 3;
    const x_division = 1024;

    const damage_factor = document.getElementById("damage").value / document.getElementById("damage-type").value;

    let x = Array(x_division * max_coeffient).fill().map((_, i) => i / x_division * damage_factor);
    let data = [];
    function add_data(fn, fil) {
        let st = performance.now();
        let y = fn(x_division, max_coeffient, damage_division, critical_probability, critical_coefficient);
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
        }
    };
    Plotly.newPlot('chart-area', data, layout);
}

function division_array_from_string(str) {
    let res = str.split(/\D+/).map(e => parseInt(e)).filter(e => !isNaN(e));
    let sum = res.reduce((s, x) => s + x, 0);
    return res.map(e => e / sum);
}

function montecarlo(x_division, max_coeffient, damage_division, critical_probability, critical_coefficient) {
    let p = Array(x_division * max_coeffient).fill(0);
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

function once_distribution(x_division, max_coeffient, damage, critical_probability, critical_coefficient) {
    let p = Array(x_division * max_coeffient).fill(0);
    for (let i = 0; i < x_division * max_coeffient; ++i) {
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

function convolution(x_division, max_coeffient, damage_division, critical_probability, critical_coefficient) {
    let p = Array(x_division * max_coeffient).fill(0);
    p[0] = 1;
    for (let damage of damage_division) {
        let p2 = once_distribution(x_division, max_coeffient, damage, critical_probability, critical_coefficient);

        let p3 = Array(x_division * max_coeffient).fill(0);
        for (let i = 0; i < x_division * max_coeffient; ++i) {
            for (let j = 0; j < x_division * max_coeffient; ++j) {
                if (i + j >= x_division * max_coeffient) break;
                p3[i + j] += p[i] * p2[j];
            }
        }
        p = p3;
    }
    return p;
}

function fft_convolution(x_division, max_coeffient, damage_division, critical_probability, critical_coefficient) {
    const n = x_division * 4;
    let prod_re = Array(n).fill(1);
    let prod_im = Array(n).fill(0);
    for (let damage of damage_division) {
        let re = once_distribution(x_division, 4, damage, critical_probability, critical_coefficient);
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
    return p.slice(0, x_division * max_coeffient);
}