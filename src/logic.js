
function once_distribution(x_division, data_len, damage, critical_probability, critical_coefficient) {
    let p = Array(data_len).fill(0);
    let f = false;
    for (let i = 0; i < data_len; ++i) {
        let x = i / x_division;
        if (damage * 0.85 <= x && x < damage) {
            p[i] += 1 / (damage * 0.15) * (1 - critical_probability) / x_division;
            f = true;
        }
        if (damage * 0.85 * critical_coefficient <= x && x < damage * critical_coefficient) {
            p[i] += 1 / (damage * 0.15 * critical_coefficient) * critical_probability / x_division;
            f = true;
        }
    }

    let s = p.reduce((s, x) => s + x);
    return { p: p.map(e => e / s), f };
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

export function fft_convolution(x_division, data_len, dat) {
    const n = next_power_of_two(data_len);
    let prod_re = Array(n).fill(1);
    let prod_im = Array(n).fill(0);
    let damage_sum = dat.reduce((s, x) => s + x.mxdamage, 0);
    for (let damage_pack of dat) {
        for (let damage of damage_pack.division) {
            let { p: re, f } = once_distribution(
                x_division, n,
                damage * damage_pack.mxdamage / damage_sum,
                damage_pack.critical_probability,
                damage_pack.critical_coefficient
            );
            if (!f) continue;

            let im = Array(n).fill(0);
            FFT(re, im, n, false);
            for (let i = 0; i < n; ++i) {
                let pr = prod_re[i];
                let pi = prod_im[i];
                prod_re[i] = pr * re[i] - pi * im[i];
                prod_im[i] = pr * im[i] + pi * re[i];
            }
        }
    }
    FFT(prod_re, prod_im, n, true);
    let p = Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
        p[i] = Math.sqrt(prod_re[i] * prod_re[i] + prod_im[i] * prod_im[i]);
    }
    return p.slice(0, data_len);
}


// from:http://www.natural-science.or.jp/article/20160920215800.php
function FFT(an, bn, N, Inverse) {
    /////////////////////////////////////////
    //参考：Javaで学ぶシミュレーションの基礎
    /////////////////////////////////////////
    // 入力
    // N  ： 項数（2のべき乗）
    // an : 実数配列（順変換：実数空間データを項数Nで指定、逆変換：展開係数a(n)）
    // bn : 実数配列（順変換：虚数空間データを項数Nで指定、逆変換：展開係数b(n)）
    // Inverse : 逆変換の場合に true
    /////////////////////////////////////////
    // 出力
    // an : 実数配列（順変換：展開係数a(n)、逆変換：実数空間データ）
    // bn : 実数配列（順変換：展開係数b(n)、逆変換：虚数空間データ）
    /////////////////////////////////////////
    let ff = Inverse ? 1 : -1;
    let rot = new Array(N);
    for (let i = 0; i < rot.length; i++) rot[i] = 0;
    let nhalf = N / 2, num = N / 2;
    let sc = 2 * Math.PI / N;
    while (num >= 1) {
        for (let j = 0; j < N; j += 2 * num) {
            let phi = rot[j] / 2;
            let phi0 = phi + nhalf;
            let c = Math.cos(sc * phi);
            let s = Math.sin(sc * phi * ff);
            for (let k = j; k < j + num; k++) {
                let k1 = k + num;
                let a0 = an[k1] * c - bn[k1] * s;
                let b0 = an[k1] * s + bn[k1] * c;
                an[k1] = an[k] - a0;
                bn[k1] = bn[k] - b0;
                an[k] = an[k] + a0;
                bn[k] = bn[k] + b0;
                rot[k] = phi;
                rot[k1] = phi0;
            }
        }
        num = num / 2;
    }
    for (let i = 0; i < N; i++) {
        let j = rot[i];
        if (j > i) {
            {
                let tmp = an[i];
                an[i] = an[j];
                an[j] = tmp;
            }
            {
                let tmp = bn[i];
                bn[i] = bn[j];
                bn[j] = tmp;
            }
        }
    }
    if (Inverse) {
        for (let i = 0; i < N; i++) {
            an[i] = an[i] / N;
            bn[i] = bn[i] / N;
        }
    }
}