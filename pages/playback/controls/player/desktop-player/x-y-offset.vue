<template>
  <div style="top: 33px; left: 11px; position: absolute">
    <DesktopPlayerControls></DesktopPlayerControls>
  </div>
</template>

<script>
import { DesktopPlayerControls } from "@/dist/mantarray.common";
// import DesktopPlayerControls from "@/components/playback/controls/player/DesktopPlayerControls.vue";

export default {
  components: {
    DesktopPlayerControls,
  },
  created: function () {
    this.$store.dispatch("flask/start_status_pinging");
    // set a valid barcode so that live view can be initiated during the tests
    this.$store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
  },
};
</script>
