<template>
  <div>
    <DesktopPlayerControls></DesktopPlayerControls>
  </div>
</template>

<script>
// import { DesktopPlayerControls } from "@/dist/mantarray.common";
import DesktopPlayerControls from "@/components/playback/controls/player/DesktopPlayerControls.vue";
import playback_module from "@/store/modules/playback";
export default {
  components: {
    DesktopPlayerControls,
  },
  created: function () {
    this.$store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED
    );

    window.addEventListener(
      "keypress",
      function (e) {
        this.$store.commit("flask/stop_status_pinging");
      }.bind(this)
    );
    // set a valid barcode so that live view can be initiated during the tests
    this.$store.commit("playback/set_barcode_number", "MA200440004");
  },
};
</script>
