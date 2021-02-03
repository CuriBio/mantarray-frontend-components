<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest :protocol_code="protocol_list"></ComponentToTest>
  </div>
</template>

<script>
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/StimulationStudioWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  data() {
    return {
      protocol_list: [],
    };
  },
};
</script>
