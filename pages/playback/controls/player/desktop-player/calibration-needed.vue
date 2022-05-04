<template>
  <div>
    <DesktopPlayerControls />
    <button class="update-idx-button" @click="update_customer_idx">Update customer idx</button>
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
    this.$store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
  },
  methods: {
    update_customer_idx: function () {
      this.$store.commit("settings/set_active_user_index", 0);
    },
  },
};
</script>
<style scoped>
.update-idx-button {
  position: absolute;
  top: 100px;
  left: 1840px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
</style>
