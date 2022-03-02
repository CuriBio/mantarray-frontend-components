<template>
  <div style="top: 100px; left: 100px; position: absolute">
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
    this.$store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.RECORDING);
    this.$store.commit("playback/set_barcode_number", "ML2022053000");
  },
};
</script>
