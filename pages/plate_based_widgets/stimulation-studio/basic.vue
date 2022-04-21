<template>
  <div>
    <ComponentToTest :protocol_codes="protocol_list"></ComponentToTest>
  </div>
</template>

<script>
// import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
import ComponentToTest from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

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
