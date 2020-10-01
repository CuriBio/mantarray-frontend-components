<template>
  <div class="div__status-bar">
    <span class="span__status-bar-text">{{ alert_txt }}</span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { STATUS } from "@/store/modules/flask/enums";

/**
 * @vue-data     {String} alert_txt - Contains the current status of the Application and its updated as status change.
 * @vue-computed {String} status_uuid - Contains a UUID which represents a meaningful information, from Vuex store.
 * @vue-event    {Event} status_uuid - A function which is invoked when UUID is modified in the Vuex store.
 */
export default {
  name: "StatusBar",
  data() {
    return {
      alert_txt: "",
    };
  },
  computed: {
    ...mapGetters({
      status_uuid: "flask/status_id",
    }),
  },
  watch: {
    status_uuid: function (newValue) {
      this.set_text_from_state(newValue);
    },
  },

  created() {
    this.set_text_from_state(this.status_uuid);
  },
  methods: {
    set_text_from_state: function (new_value) {
      this.alert_txt = "Status: ";
      switch (new_value) {
        case STATUS.MESSAGE.SERVER_STILL_INITIALIZING:
          this.alert_txt += "Connecting...";
          break;
        case STATUS.MESSAGE.SERVER_READY:
          this.alert_txt += "Connecting...";
          break;
        case STATUS.MESSAGE.INITIALIZING_INSTRUMENT:
          this.alert_txt += "Initializing...";
          break;
        case STATUS.MESSAGE.CALIBRATION_NEEDED:
          this.alert_txt += `Connected...Calibration Needed`;
          break;
        case STATUS.MESSAGE.CALIBRATING:
          this.alert_txt += `Calibrating...`;
          break;
        case STATUS.MESSAGE.CALIBRATED:
          this.alert_txt += `Ready`;
          break;
        case STATUS.MESSAGE.BUFFERING:
          this.alert_txt += `Preparing for Live View...`;
          break;
        case STATUS.MESSAGE.LIVE_VIEW_ACTIVE:
          this.alert_txt += `Live View Active`;
          break;
        case STATUS.MESSAGE.RECORDING:
          this.alert_txt += `Recording to File`;
          break;
        case STATUS.MESSAGE.ERROR:
          this.alert_txt += `Error Occurred`;
          break;
        default:
          this.alert_txt = `Status:` + new_value; // to be 43 characters and include the UUID, there isn't room for a space
          break;
      }
    },
  },
};
</script>
<style>
.div__status-bar {
  top: 0px;
  left: 0px;
  width: 288px;
  height: 32px;
  background: #1c1c1c;
  border: none;
  border-radius: 0px;
  position: absolute;
}

.span__status-bar-text {
  pointer-events: all;
  line-height: 100%;
  overflow: hidden;
  position: absolute;
  width: 274px;
  height: 23px;
  top: 5px;
  left: 11px;
  padding: 5px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: italic;
  text-decoration: none;
  font-size: 13px;
  color: #ffffff;
  text-align: left;
  z-index: 101;
}
</style>
