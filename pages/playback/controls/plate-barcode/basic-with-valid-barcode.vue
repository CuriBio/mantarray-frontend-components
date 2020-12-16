<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { PlateBarcode as ComponentToTest } from "../../../../dist/mantarray.common";
//    import ComponentToTest from "@/components/playback/controls/PlateBarcode.vue";

export default {
  components: {
    ComponentToTest,
  },
  created() {
    this.$store.commit("playback/set_barcode_number", "ME202050002");
  },
};
</script>
