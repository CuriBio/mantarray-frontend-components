<template>
  <div class="div__status-bar">
    <span class="span__status-bar-text">{{ alert_txt }}</span>
    <span>
      <b-modal
        id="error-catch"
        size="sm"
        hide-footer
        hide-header
        hide-header-close
        :static="true"
      >
        <ErrorCatchWidget
          id="error"
          :log_filepath="log_path"
          @ok-clicked="remove_error_catch"
        ></ErrorCatchWidget>
      </b-modal>
    </span>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import { STATUS } from "@/store/modules/flask/enums";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import ErrorCatchWidget from "@/components/status/ErrorCatchWidget.vue";

Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
Vue.component("BModal", BModal);
/**
 * @vue-data     {String} alert_txt - Contains the current status of the Application and its updated as status change.
 * @vue-computed {String} status_uuid - Contains a UUID which represents a meaningful information, from Vuex store.
 * @vue-event    {Event} status_uuid - A function which is invoked when UUID is modified in the Vuex store.
 */
export default {
  name: "StatusBar",
  components: {
    ErrorCatchWidget,
  },
  data() {
    return {
      alert_txt: "",
    };
  },
  computed: {
    ...mapGetters({
      status_uuid: "flask/status_id",
    }),
    ...mapState("settings", {
      log_path: "log_path",
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
      const shutdown_url = "http://localhost:4567/shutdown";
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
          Vue.axios.get(shutdown_url);
          this.alert_txt += `Error Occurred`;
          this.$bvModal.show("error-catch");
          break;
        case STATUS.MESSAGE.SHUTDOWN:
          this.alert_txt += `Shutting Down`;
          break;
        default:
          this.alert_txt = `Status:` + new_value; // to be 43 characters and include the UUID, there isn't room for a space
          break;
      }
    },
    remove_error_catch: function () {
      this.$bvModal.hide("error-catch");
      this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.SHUTDOWN);
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
