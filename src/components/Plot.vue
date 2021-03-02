<template>
  <div id="Plot">
    <div id="canvas"></div>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  name: "Plot",
  mounted: function () {
    let x = Array(100);
    let y = Array(100);
    for (let i = 0; i < 100; ++i) {
      x[i] = i / 10;
      y[i] = Math.sin(i / 10) + 2;
    }
    let data = [];
    data.push({
      x,
      y,
      type: "line",
    });
    let layout = {
      title: "Damage Dsitribution",
      xaxis: {
        title: "Damege",
        // fixedrange: true,
        // range: [0, 3],
      },
      yaxis: {
        ticklabelposition: "inside",
        title: "Probability Density [/ damage]",
        fixedrange: true,
      },
      margin: {
        l: 30,
        r: 10,
        pad: 0,
      },
    };
    Plotly.newPlot("canvas", data, layout, { responsive: true });
  },
};
</script>

<style scoped>
</style>