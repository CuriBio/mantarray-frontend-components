<template>
  <div style="top: 33px; left: 11px; position: absolute">
    <DesktopPlayerControls></DesktopPlayerControls>
  </div>
</template>

<script>
import { DesktopPlayerControls } from "@/dist/mantarray.common";

export default {
  components: {
    DesktopPlayerControls,
  },
  created: function () {
    this.$store.dispatch("flask/start_status_pinging");
    // set a valid barcode so that live view can be initiated during the tests
    this.$store.commit("playback/set_barcode_number", "MA200440004");
  },
};
</script>
