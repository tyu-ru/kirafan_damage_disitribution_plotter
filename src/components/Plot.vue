<template>
  <div id="Plot">
    <div>
      <label>
        <input type="checkbox" v-model="auto_scale_x_min" />
        auto scale x min
      </label>
      <label>
        <input type="checkbox" v-model="fixed_range" />
        fixed range
      </label>
    </div>
    <div id="canvas"></div>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  name: "Plot",
  props: {
    plot_data: Object,
    sample_range_min: Number,
    sample_range_max: Number,
  },
  data() {
    return {
      auto_scale_x_min: false,
      fixed_range: true,
    };
  },
  mounted: function () {
    this.render();
  },
  watch: {
    plot_data: function () {
      this.render();
    },
    sample_range_min: function () {
      this.render();
    },
    sample_range_max: function () {
      this.render();
    },
    auto_scale_x_min: function () {
      this.render();
    },
    fixed_range: function () {
      this.render();
    },
  },
  methods: {
    render: function () {
      let { plot_data, x_range } = this.plot_data;

      let data = [
        {
          x: plot_data.x,
          y: plot_data.y,
          type: "line",
          fill: "tozeroy",
        },
      ];

      let shapes = [
        {
          type: "rect",
          xref: "x",
          yref: "paper",
          x0: this.sample_range_min,
          x1: this.sample_range_max,
          y0: 0,
          y1: 1,
          fillcolor: "#d3d3d3",
          opacity: 0.2,
          line: { width: 0 },
        },
      ];
      let add_line = function (x) {
        shapes.push({
          type: "line",
          xref: "x",
          yref: "paper",
          x0: x,
          x1: x,
          y0: 0,
          y1: 1,
          line: {
            color: "#ff0000",
            width: 1,
          },
        });
      };
      add_line(this.sample_range_min);
      add_line(this.sample_range_max);

      let layout = {
        title: "Damage Dsitribution",
        xaxis: {
          title: "Damege",
          fixedrange: this.fixed_range,
          dtick: x_range.dtick,
          range: [this.auto_scale_x_min ? x_range.mn : 0, x_range.mx],
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
        shapes,
      };
      Plotly.newPlot("canvas", data, layout, { responsive: true });

      document.getElementById("canvas").on("plotly_click", (e) => {
        this.$emit("set_sample_range_val", e.points[0].x);
      });
    },
  },
};
</script>

<style scoped>
</style>