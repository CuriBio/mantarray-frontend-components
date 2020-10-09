<template>
  <div>
    <ComponentToTest
      :classname="plate"
      :svg_height="100"
      :svg_width="100"
      :circle_x="50"
      :circle_y="50"
      :radius="40"
      strk="#FF5733"
      plate_fill="#008000"
      :stroke_wdth="4"
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
