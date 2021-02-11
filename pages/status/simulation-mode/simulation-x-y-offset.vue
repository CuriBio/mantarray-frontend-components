<template>
  <div class="simulation-x-y-offset">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { SimulationMode as ComponentToTest } from "@/dist/mantarray.common";
//  import ComponentToTest from "@/components/status/StatusBar.vue";

export default {
  components: {
    ComponentToTest,
  },
  mounted() {
    this.$store.commit("flask/set_simulation_status", true);
  },
};
</script>
<style>
.simulation-x-y-offset *,
.simulation-x-y-offset *:before,
.simulation-x-y-offset *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.simulation-x-y-offset {
  top: 111px;
  left: 88px;
  position: absolute;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
</style>
