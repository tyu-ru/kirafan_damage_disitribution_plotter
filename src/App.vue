<template>
  <div id="app">
    <h1>Kirafan Damage Distribution Plotter</h1>
    <p>PCかタブレット端末推奨です</p>
    <p>説明はページ下部にあります</p>

    <table>
      <tr>
        <th>Attack Division</th>
        <th>Damage</th>
        <th>Damage Type</th>
        <th>Critical Probability</th>
        <th>Critical Damage Change</th>
      </tr>
      <DamageInput
        v-for="(input, idx) in inputdata"
        :key="idx"
        v-model="input.v"
      ></DamageInput>
    </table>

    <button v-on:click="add_pack">add</button>
    <button v-on:click="rem_pack">rem</button>

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
      sample_range_min: 700,
      sample_range_max: 800,
      inputdata: [],
      pick_target: null,
    };
  },
  created() {
    this.add_pack();
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
    inputdata: {
      deep: true,
      handler() {
        if (!this.inputdata.length) {
          return;
        }
        const max_cofficient = 3;
        const data_len = x_division * max_cofficient;
        let x = Array(data_len)
          .fill()
          .map((_, i) => i * this.damage_par_index());

        let y = fft_convolution(
          x_division,
          data_len,
          this.inputdata.map((input) => {
            return {
              division: input.v.division,
              mxdamage: input.v.mxdamage,
              critical_probability: input.v.prob,
              critical_coefficient: input.v.critical_coefficient,
            };
          })
        );

        this.plot_data = {
          plot_data: {
            x,
            y: y.map((e) => e / this.damage_par_index()),
          },
          x_range: {
            mn: this.damage_par_index() * x_division * 0.8,
            mx: this.inputdata.reduce(
              (s, x) => s + x.v.mxdamage * (x.v.critical_coefficient + 0.05),
              0
            ),
            dtick: 0.1 * this.damage_par_index() * x_division,
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
  },
  methods: {
    add_pack() {
      this.inputdata.push({
        v: {
          division: [1, 1, 1, 1, 1],
          mxdamage: 1000,
          critical_probability: 0.2,
          critical_coefficient: 1.5,
        },
      });
    },
    rem_pack() {
      if (this.inputdata.length > 1) {
        this.inputdata.pop();
      }
    },
    damage_par_index() {
      return this.inputdata.reduce((s, x) => s + x.v.mxdamage, 0) / x_division;
    },
    set_sample_val(x) {
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
