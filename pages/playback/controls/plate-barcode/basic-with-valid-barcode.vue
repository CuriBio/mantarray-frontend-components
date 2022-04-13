<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { BarcodeViewer as ComponentToTest } from "../../../../dist/mantarray.common";
//    import ComponentToTest from "@/components/playback/controls/BarcodeViewer.vue";

export default {
  components: {
    ComponentToTest,
  },
  created() {
    this.$store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
  },
};
</script>
