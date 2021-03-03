<template>
  <input
    v-model.trim="division"
    placeholder="1 1 1 1 1"
    pattern="\s*(\d*\s*[:,]?\s*)*"
  />
</template>

<script>
export default {
  name: "DamageDivisionInput",
  props: {
    value: Array,
  },
  data() {
    return {
      division: "",
    };
  },
  mounted() {
    this.division = this.value.join(" ");
  },
  watch: {
    division: function (val) {
      let v = val
        .split(/\D+/)
        .map((e) => parseInt(e))
        .filter((e) => !isNaN(e));
      let s = v.reduce((s, x) => s + x, 0);
      this.$emit(
        "input",
        v.map((e) => e / s)
      );
    },
  },
};
</script>

<style scoped>
</style>
