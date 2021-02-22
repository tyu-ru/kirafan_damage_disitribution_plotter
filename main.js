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

    document.getElementById("damage-sample-min-pick").onclick = () => {
        pick_target = document.getElementById("damage-sample-min");
        render();
    };
    document.getElementById("damage-sample-max-pick").onclick = () => {
        pick_target = document.getElementById("damage-sample-max");
        render();
    };
    document.getElementById("fixed-range").onchange = render;
    document.getElementById("auto-scale-x-min").onchange = render;

    solve();
    set_description();
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

    let factor = 0;
    switch (document.getElementById("damage-type").value) {
        case "cri-ex": factor = 0.925 * critical_coefficient; break;
        case "cri-mx": factor = critical_coefficient; break;
        case "nocri-ex": factor = 0.925; break;
        case "nocri-mx": factor = 1; break;
    }

    const damage_factor = document.getElementById("damage").value / factor;
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
    const auto_scale_x_min = document.getElementById("auto-scale-x-min").checked;
    const fixed_range = document.getElementById("fixed-range").checked;

    const damage_par_index = param.damage_factor / param.x_division;

    let x = Array(param.data_len).fill().map((_, i) => i * damage_par_index);
    let data = [];
    data.push({
        x: x,
        y: distribution.map(e => e / damage_par_index),
        type: "line",
        name: "fft_convolution",
        fill: "tozeroy",
    });

    let layout = {
        title: 'Damage Dsitribution',
        // showlegend: false,
        yaxis: {
            ticklabelposition: "inside",
            title: "Probability Density [/ damage]",
            fixedrange: true
        },
        xaxis: {
            title: "Damage",
            fixedrange: fixed_range,
            dtick: 0.1 * param.damage_factor,
            range: [
                auto_scale_x_min ? param.damage_factor * 0.8 : 0,
                (param.critical_coefficient + 0.05) * param.damage_factor
            ]
        },
        // // autosize: true,
        margin: {
            l: 30,
            r: 10,
            pad: 0,
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

    let min_index = Math.min(Math.round(param.damage_sample_min / damage_par_index), param.data_len);
    let max_index = Math.min(Math.round(param.damage_sample_max / damage_par_index), param.data_len);
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


function set_description() {
    let markdown = (function () {/*

# Description

攻撃時のダメージの分布を調べるためのツールです。

ほぼ自分用なところがあるので、細かい調整はしてません。

[解析wiki](https://wiki.kirafan.moe/)と[きらファン計算機](https://calc.kirafan.moe/#/home)との併用前提なところがあります

出力されるグラフは確率密度分布です。縦軸の具体的な値は気にしないでください。(一応`/damage`単位の数値になってる...はず)

計算方法の都合上ある程度誤差があります。

~~htmlもjsも初めてだから低クオリティは許して~~

## Attack Division

攻撃の段数と威力分布を示す整数列です。
解析wikiに記載されてます。

例として

- 星5青葉(風魔) とっておき
  - `1 1 1 1 1`
- 星5千矢(火盾) クラススキル1
  - `3 3 3 3 8`
- 星5千矢(風魔) とっておき
  - `1 1`

などです。区切り文字は空白でも`:`でもなんでもおｋです。

## Critical Probability

クリティカル確率です。

## Critical Damage Change

クリティカルダメージ量の変化です。

最大100%最小-33%です。

参考までに、

- ゆの専用武器 +33%
- かおす先生専用武器 +17%
- サンリオアリス/冠 +16.3%
- ごちうさ/きらファンオーブ +17%

## Damage

ダメージの期待値もしくは最大値を入力してください

入力した値に応じて隣のboxの中身を選んでください

- expect(critical)
  - 入力値がクリティカル時の期待値(きらファン計算機ででかでかと表示される値です)
- maximum(critical)
  - 入力値がクリティカル時の最大値
- expect(not critical)
  - 入力値が非クリティカル時の期待値
- maximum(not critical)
  - 入力値が非クリティカル時の最大値

## Damage Sample

グラフの積分用の設定値です。

グラフ上にある赤い枠の両端を設定します。この範囲の確率を計算できます。

`pick`ボタンを推してからグラフ上をクリックするとその地点のx座標が選択されます。

選択範囲の積分値が`Probability = xx %`として入力欄の下に表示されます。

## その他設定

- auto scale x min
  - チェックが入っているとグラフのx軸範囲の下限を自動調整します。
  - オフでグラフ原点を表示範囲に含むようになります(デフォルト)
- fixed-range
  - チェックが入っているとグラフの表示範囲が固定されます(デフォルト)
  - オフの時は拡大とか移動とかできます。
  - グラフのy軸方向の拡大、移動はできないようにしてます

## Author

ちゅーる [@tyuru_kirafan](https://twitter.com/tyuru_kirafan)

*/}).toString().match(/\/\*([^]*)\*\//)[1];
    document.getElementById("description").innerHTML = marked(markdown);
}
