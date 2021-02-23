<template>
  <div>
    <ComponentToTest
      :gradient_uuid="value"
      :lower_range="'0'"
      :upper_range="'100'"
      :heatmap_height="50"
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
      value: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      height: 481,
    };
  },
};
</script>
