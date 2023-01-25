<template>
  <div style="top: 155px; left: 300px; position: absolute">
    <ComponentToTest :platecolor="passing_plate_colors"></ComponentToTest>
  </div>
</template>

<script>
import { PlateMapWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/PlateMapWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    const plate_colors = [
      "#871d28",
      "#bd3532",
      "#df6147",
      "#f0a061",
      "#871d28",
      "#bd3532",
      "#df6147",
      "#f0a061",
      "#83c0b3",
      "#83c0b3",
      "#83c0b3",
      "#f9d78c",
      "#45847b",
      "#45847b",
      "#45847b",
      "#f9d78c",
      "#24524b",
      "#24524b",
      "#24524b",
      "#24524b",
      "#133836",
      "#133836",
      "#133836",
      "#133836",
    ];
    this.passing_plate_colors = plate_colors;
  },
};
</script>
