<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest
      :gradient_uuid="provided_uuid"
      :lower_range="lower"
      :upper_range="upper"
      :heatmap_height="height"
      :gradient_range="range"
    ></ComponentToTest>
  </div>
</template>

<script>
import { HeatMapColorBar as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/status/HeatMapColorBar.vue";

export default {
  components: {
    ComponentToTest,
  },
  data() {
    return {
      provided_uuid: "0",
      height: 481,
      lower: 500,
      upper: 1500,
      range: [
        { color: "#ffffff", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    };
  },
};
</script>
