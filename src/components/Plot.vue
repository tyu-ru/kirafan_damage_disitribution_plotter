<template>
  <div id="Plot">
    <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
  </div>
</template>

<script>
import { Plotly } from "vue-plotly";

export default {
  name: "Plot",
  components: {
    Plotly,
  },
  data() {
    let x = Array(100);
    let y = Array(100);
    for (let i = 0; i < 100; ++i) {
      x[i] = i / 10;
      y[i] = Math.sin(i / 10);
    }
    let data = [];
    data.push({
      x,
      y,
      type: "line",
    });
    return { data, layout: { title: "aaa" } };
  },
  mounted: function () {
    // Plotly.newPlot(this.$el, data, {}, { responsive: true });
  },
};
</script>

<style scoped>
</style>