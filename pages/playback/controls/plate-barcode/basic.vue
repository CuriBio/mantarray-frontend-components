<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { BarcodeViewer as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/BarcodeViewer.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
