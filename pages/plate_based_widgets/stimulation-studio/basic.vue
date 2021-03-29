<template>
  <div>
    <ComponentToTest :protocol_codes="protocol_list"></ComponentToTest>
    <span
      id="test-1"
      style="top: 0px; position: absolute; left: 500px"
      @click="teal_color"
      >Teal</span
    >
    <span
      id="test-2"
      style="top: 0px; position: absolute; left: 700px"
      @click="blue_color"
      >Blue</span
    >
    <span
      id="test-3"
      style="top: 0px; position: absolute; left: 900px"
      @click="yellow_color"
      >Yellow</span
    >
    <span
      id="test-4"
      style="top: 0px; position: absolute; left: 1100px"
      @click="orange_color"
      >Orange</span
    >
  </div>
</template>

<script>
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/StimulationStudioWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  data() {
    return {
      protocol_list: [],
    };
  },
  created() {
    this.protocol_list1 = Array.from(Array(24).keys());
    this.protocol_list2 = [];
    for (let i = 24; i < 52; i++) this.protocol_list2.push(i);
    this.protocol_list3 = [];
    for (let j = 52; j < 77; j++) this.protocol_list3.push(j);
    this.protocol_list4 = [];
    for (let k = 78; k < 95; k++) this.protocol_list4.push(k);
    for (let l = 0; l < 9; l++) this.protocol_list4.push(l);
  },
  methods: {
    teal_color() {
      this.protocol_list = this.protocol_list1;
    },
    blue_color() {
      this.protocol_list = this.protocol_list2;
    },
    yellow_color() {
      this.protocol_list = this.protocol_list3;
    },
    orange_color() {
      this.protocol_list = this.protocol_list4;
    },
  },
};
</script>
