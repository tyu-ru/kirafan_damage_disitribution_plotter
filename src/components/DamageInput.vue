<template>
  <tr id="DamageInput">
    <td>
      <DamageDivisionInput v-model="division"></DamageDivisionInput>
    </td>
    <td>
      <input type="number" v-model.number="damage" min="0" step="1" />
    </td>
    <td>
      <select v-model="damagetype">
        <option v-bind:value="0">Expected(critical)</option>
        <option v-bind:value="1">Maximum(critical)</option>
        <option v-bind:value="2">Expected(not-critical)</option>
        <option v-bind:value="3">Maximum(not-critical)</option>
      </select>
    </td>

    <td>
      <input type="number" v-model.number="prob" min="0" max="100" step="1" />
    </td>
    <td>
      <input
        type="number"
        v-model.number="damagechange"
        min="-33"
        max="100"
        step="1"
      />
    </td>
  </tr>
</template>

<script>
import DamageDivisionInput from "./DamageDivisionInput.vue";
export default {
  components: { DamageDivisionInput },
  name: "DamageInput",
  data() {
    return {
      division: [1, 1, 1, 1, 1],
      damage: 1000,
      damagetype: 0,
      prob: 20,
      damagechange: 0,
    };
  },
  watch: {
    division: function () {
      this.emit();
    },
    damage: function () {
      this.emit();
    },
    damagetype: function () {
      this.emit();
    },
    prob: function () {
      this.emit();
    },
    damagechange: function () {
      this.emit();
    },
  },
  methods: {
    emit: function () {
      let clamp = (x, l, h) => Math.min(Math.max(x, l), h);

      const critical_coefficient =
        1.5 * (1 + clamp(this.damagechange, -33, 100) / 100);
      let mxdamage = Math.max(this.damage, 0);
      switch (this.damagetype) {
        case 0:
          mxdamage /= 0.925 * critical_coefficient;
          break;
        case 1:
          mxdamage /= 1 * critical_coefficient;
          break;
        case 2:
          mxdamage /= 0.925;
          break;
        case 3:
          mxdamage /= 1;
          break;
        default:
          alert("internal error : DamageType Unexpect");
          break;
      }
      this.$emit("input", {
        division: this.division,
        mxdamage,
        prob: clamp(this.prob, 0, 100) / 100,
        critical_coefficient,
      });
    },
  },
};
</script>

<style scoped>
</style>