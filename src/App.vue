<template>
  <div id="app">
    <h1>Kirafan Damage Distribution Plotter</h1>
    <p>Recomended: PC or Tablet.</p>
    <p>Instructions are at bottom of the page.</p>
    <DamageInput v-model="inputdata"></DamageInput>

    <div>
      Damage Sample
      <input type="number" v-model.number="sample_range_min" />
      <button v-on:click="pick_target = 'min'">pick</button>
      ~
      <input type="number" v-model.number="sample_range_max" />
      <button v-on:click="pick_target = 'max'">pick</button>
    </div>

    <div style="font-weight: bold">
      Probability = {{ integral_probability }}%
    </div>

    <Plot
      :plot_data="plot_data"
      :sample_range_min="sample_range_min"
      :sample_range_max="sample_range_max"
      @set_sample_range_val="set_sample_val"
    ></Plot>
    <Description></Description>
  </div>
</template>

<script>
import DamageInput from "./components/DamageInput.vue";
import Plot from "./components/Plot.vue";
import Description from "./components/Description.vue";

import { fft_convolution } from "./logic.js";

const x_division = 1000;

export default {
  name: "App",
  components: {
    DamageInput,
    Plot,
    Description,
  },
  data() {
    return {
      plot_data: {
        plot_data: { x: [0], y: [0] },
        x_range: { mn: 0, mx: 1, dtick: 1 },
      },
      cumsum: [0, 0],
      sample_range_min: 0,
      sample_range_max: 1,
      inputdata: "",
      pick_target: null,
    };
  },
  computed: {
    integral_probability() {
      let min_index = Math.min(
        Math.round(this.sample_range_min / this.damage_par_index()),
        this.cumsum.length - 1
      );
      let max_index = Math.min(
        Math.round(this.sample_range_max / this.damage_par_index()),
        this.cumsum.length - 1
      );
      let range_integral = this.cumsum[max_index] - this.cumsum[min_index];
      return Math.round(range_integral * 1000) / 10;
    },
  },
  watch: {
    inputdata: function () {
      const max_cofficient = 3;
      const data_len = x_division * max_cofficient;
      let x = Array(data_len)
        .fill()
        .map((_, i) => i * this.damage_par_index());

      let y = fft_convolution(
        x_division,
        data_len,
        this.inputdata.division,
        this.inputdata.prob,
        this.inputdata.critical_cofficient
      );

      this.plot_data = {
        plot_data: {
          x,
          y: y.map((e) => e / this.damage_par_index()),
        },
        x_range: {
          mn: 0.8 * this.inputdata.mxdamage,
          mx:
            this.inputdata.mxdamage *
            (this.inputdata.critical_cofficient + 0.05),
          dtick: 0.1 * this.inputdata.mxdamage,
        },
      };
      let cumsum = Array(data_len + 1);
      cumsum[0] = 0;
      for (let i = 0; i < data_len; ++i) {
        cumsum[i + 1] = cumsum[i] + y[i];
      }
      this.cumsum = cumsum;
    },
  },
  methods: {
    damage_par_index() {
      return this.inputdata.mxdamage / x_division;
    },
    set_sample_val: function (x) {
      x = Math.floor(x);
      if (this.pick_target === "min") {
        this.sample_range_min = x;
      } else if (this.pick_target === "max") {
        this.sample_range_max = x;
      }
      this.pick_target = null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
