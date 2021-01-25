<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { SimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/SimulationStudioWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
