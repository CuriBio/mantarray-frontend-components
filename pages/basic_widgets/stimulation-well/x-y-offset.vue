<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest
      :classname="'plate_0'"
      :protocol_type="'A'"
      :svg_height="72"
      :svg_width="72"
      :circle_x="36"
      :circle_y="36"
      :radius="28"
      :stroke="'#1C1C1C'"
      :protocol_fill="'#df6147'"
      :stroke_width="0"
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
