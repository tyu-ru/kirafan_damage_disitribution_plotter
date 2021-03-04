<template>
  <div id="description"></div>
</template>

<script>
import marked from "marked";
import readme from "raw-loader!../../README.md";

export default {
  name: "Description",
  mounted: function () {
    this.$el.innerHTML = marked(readme);
  },
};
</script>

<style scoped>
</style>
