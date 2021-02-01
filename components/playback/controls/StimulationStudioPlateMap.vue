<template>
  <div>
    <div class="div__simulationstudio-plate-well-location-zero">
      <PlateWell
        :classname="'plate_0'"
        :svg_height="72"
        :svg_width="72"
        :circle_x="36"
        :circle_y="36"
        :radius="28"
        :strk="'#FFFFFF'"
        :plate_fill="'#19AC8A'"
        :stroke_wdth="4"
        :index="0"
      ></PlateWell>
    </div>
    <span
      class="span__simulationstudio-plate-well-location-zero-protocol-value"
    >
      A
    </span>
  </div>
</template>
<script>
import PlateWell from "@/components/playback/controls/PlateWell.vue";

export default {
  name: "StimulationStudioPlateMap",
  components: {
    PlateWell,
  },
  props: {
    classname: { type: String, default: "" },
    svg_height: { type: Number, default: 0 },
    svg_width: { type: Number, default: 0 },
    circle_x: { type: Number, default: 0 },
    circle_y: { type: Number, default: 0 },
    radius: { type: Number, default: 0 },
    strk: { type: String, default: "" },
    protocol_fill: { type: String, default: "" },
    stroke_wdth: { type: Number, default: 0 },
    index: { type: Number, default: 0 },
    protocol_type: { type: String, default: "" },
  },
};
</script>
