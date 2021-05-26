<template>
  <div>
    <!-- prettier-ignore -->
    <ComponentToTest :gradient_uuid="provided_uuid" :lower_range="lower" :upper_range="upper" :heatmap_height="height" :gradient_range="range" :units="unit"></ComponentToTest>

    <div class="test1" style="top: 111px; left: 300px; position: absolute" @click="change_gradient">
      change gradient
    </div>
    <div class="test2" style="top: 222px; left: 300px; position: absolute" @click="change_uuid">
      default UUID
    </div>
    <div class="test3" style="top: 333px; left: 300px; position: absolute" @click="change_height">
      change height
    </div>
    <div class="test4" style="top: 444px; left: 300px; position: absolute" @click="change_range">
      change range
    </div>
    <div class="test5" style="top: 555px; left: 300px; position: absolute" @click="change_units">
      change units
    </div>
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
      provided_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      height: 481,
      lower: 0,
      upper: 100,
      range: [],
      unit: "μN",
    };
  },
  methods: {
    change_gradient: function () {
      this.provided_uuid = " ";
      this.range = [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ];
    },
    change_uuid: function () {
      this.provided_uuid = "0f81155d-23ec-4790-a3fe-92a6cc7c3c47";
      this.range = [];
    },
    change_height: function () {
      this.height = 400;
    },
    change_range: function () {
      this.lower = 10;
      this.upper = 900;
    },
    change_units: function () {
      this.unit = "mA";
    },
  },
};
</script>
