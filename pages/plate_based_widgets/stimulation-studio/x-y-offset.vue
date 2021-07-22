<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest :protocol_codes="protocol_list"></ComponentToTest>
  </div>
</template>

<script>
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
// import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

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
