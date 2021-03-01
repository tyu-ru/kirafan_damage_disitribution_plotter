<template>
  <div id="app">
    <h1>Kirafan Damage Distribution Plotter</h1>
    <p>Recomended: PC or Tablet.</p>
    <p>Instructions are at bottom of the page.</p>
    <Description></Description>
  </div>
</template>

<script>
import Description from "./components/Description.vue";

export default {
  name: "App",
  components: {
    Description,
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
