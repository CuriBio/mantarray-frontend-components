<template>
  <div style="top: 100px; left: 100px; position: absolute">
    <DesktopPlayerControls></DesktopPlayerControls>
  </div>
</template>

<script>
// import { DesktopPlayerControls } from "@/dist/mantarray.common";
import DesktopPlayerControls from "@/components/playback/controls/player/DesktopPlayerControls.vue";

export default {
  components: {
    DesktopPlayerControls,
  },
  created: function () {
    this.$store.commit("playback/set_barcode_number", "MA200440004");
  },
};
</script>
