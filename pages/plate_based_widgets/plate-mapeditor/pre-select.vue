<template>
  <div>
    <ComponentToTest :selected="pre_select_wells" :platecolor="passing_plate_colors"></ComponentToTest>
  </div>
</template>

<script>
import { PlateMapWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/plate_based_widgets/mapeditor/PlateMapWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    const select = [
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
      true,
    ];
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
    this.pre_select_wells = select;
  },
};
</script>
