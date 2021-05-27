<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <StimulationStudioWidget
      :protocol_codes="protocol_list"
    ></StimulationStudioWidget>
  </div>
</template>

<script>
// import { StimulationStudioWidget as ComponentToTest } from '@/dist/mantarray.common';
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

export default {
  components: {
    StimulationStudioWidget,
  },
  data() {
    return {
      protocol_list: ["B", "C"],
    };
  },
};
</script>
