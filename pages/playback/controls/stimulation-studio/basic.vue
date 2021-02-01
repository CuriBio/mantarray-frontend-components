<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/StimulationStudioWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
