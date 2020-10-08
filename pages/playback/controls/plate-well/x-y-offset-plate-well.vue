<template>
  <div style="top: 300px; left: 300px; position: absolute">
    <ComponentToTest
      :classname="plate"
      :svg_height="200"
      :svg_width="200"
      :circle_x="100"
      :circle_y="100"
      :radius="75"
      strk="#FFC733"
      plate_fill="#3393FF"
      :stroke_wdth="10"
      :index="0"
      @enter-well="on_wellenter"
      @leave-well="on_wellleave"
    ></ComponentToTest>
  </div>
</template>

<script>
import { PlateWell as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/PlateWell.vue";

export default {
  components: {
    ComponentToTest,
  },
  methods: {
    on_wellenter() {},
    on_wellleave() {},
  },
};
</script>
