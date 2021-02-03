<template>
  <div>
    <ComponentToTest :protocol_code="protocol_list"></ComponentToTest>
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
      // protocol_list : Array.from(Array(24).keys()),
      protocol_list: [],
    };
  },
  created() {
    this.protocol_list2 = [];
    for (let i = 24; i < 52; i++) this.protocol_list2.push(i);
    this.protocol_list3 = [];
    for (let j = 52; j < 77; j++) this.protocol_list3.push(j);
    this.protocol_list4 = [];
    for (let k = 78; k < 95; k++) this.protocol_list4.push(k);
    for (let l = 0; l < 9; l++) this.protocol_list4.push(l);
  },
};
</script>
