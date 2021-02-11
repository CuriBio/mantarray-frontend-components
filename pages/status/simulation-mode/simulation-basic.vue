<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { SimulationMode as ComponentToTest } from "@/dist/mantarray.common";
//  import ComponentToTest from "@/components/status/SimulationMode.vue";

export default {
  components: {
    ComponentToTest,
  },
  mounted() {
    this.$store.commit("flask/set_simulation_status", true);
  },
};
</script>
