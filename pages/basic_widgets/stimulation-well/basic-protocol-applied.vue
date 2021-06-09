<template>
  <div>
    <ComponentToTest
      :protocol_type="'A'"
      :stroke="'#FFFFFF'"
      :protocol_fill="'#19AC8A'"
      :stroke_width="4"
      :index="0"
    ></ComponentToTest>
  </div>
</template>

<script>
import { StimulationStudioPlateWell as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/StimulationStudioPlateWell.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
