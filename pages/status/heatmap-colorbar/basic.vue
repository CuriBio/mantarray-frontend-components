<template>
  <div>
    <ComponentToTest
      :gradient_uuid="value"
      :lower_range="'0'"
      :upper_range="'100'"
      :heatmap_height="481"
      :gradient_range="range"
    ></ComponentToTest>
    <span style="top: 500px; left: 88px; position: absolute" @click="clickone">
      change gradient</span
    >
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
      range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    };
  },
  methods: {
    clickone: function () {
      if (this.value == 4) {
        this.value = 0;
      }
      this.value = this.value + 1;
    },
  },
};
</script>
