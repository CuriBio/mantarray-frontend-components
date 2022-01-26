<template>
  <div class="div__status-bar">
    <span class="span__status-bar-text">{{ alert_txt }}</span>
    <span>
      <b-modal id="error-catch" size="sm" hide-footer hide-header hide-header-close :static="true">
        <ErrorCatchWidget
          id="error"
          :log_filepath="log_path"
          :shutdown_error_message="shutdown_error_message"
          @ok-clicked="remove_error_catch"
        ></ErrorCatchWidget>
      </b-modal>
      <b-modal
        id="fw-updates-complete-message"
        size="sm"
        hide-footer
        hide-header
        hide-header-close
        :static="true"
      >
        <StatusWarningWidget
          id="fw-updates-complete"
          :modal_labels="fw_updates_complete_labels"
          @handle_confirmation="close_fw_updates_complete_modal"
        />
      </b-modal>
      <b-modal
        id="fw-updates-in-progress-message"
        size="sm"
        hide-footer
        hide-header
        hide-header-close
        :static="true"
      >
        <StatusWarningWidget
          id="fw-updates-in-progress"
          :modal_labels="fw_updates_in_progress_labels"
          @handle_confirmation="close_fw_updates_in_progress_modal"
        />
      </b-modal>
      <b-modal id="sw-update-message" size="sm" hide-footer hide-header hide-header-close :static="true">
        <StatusWarningWidget
          id="sw-update"
          :modal_labels="sw_update_labels"
          @handle_confirmation="close_sw_update_modal"
        />
      </b-modal>
      <b-modal id="fw-closure-warning" size="sm" hide-footer hide-header hide-header-close :static="true">
        <StatusWarningWidget
          id="fw-closure"
          :modal_labels="fw_closure_warning_labels"
          @handle_confirmation="handle_confirmation"
        />
      </b-modal>
      <b-modal id="ops-closure-warning" size="sm" hide-footer hide-header hide-header-close :static="true">
        <StatusWarningWidget id="ops-closure" @handle_confirmation="handle_confirmation" />
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
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";

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
    StatusWarningWidget,
  },
  props: {
    confirmation_request: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      alert_txt: "",
      fw_updates_in_progress_labels: {
        header: "Important!",
        msg_one: "The firmware update has begun.",
        msg_two: "Do not close the Mantarray software or power off the Mantarray instrument.",
        button_names: ["Okay"],
      },
      fw_closure_warning_labels: {
        header: "Warning!",
        msg_one:
          "A firmware update for the Mantarray instrument is in progress. Closing the software now could damage the instrument.",
        msg_two: "Are you sure you want to exit?",
        button_names: ["Cancel", "Yes"],
      },
      fw_updates_complete_labels: {
        header: "Important!",
        msg_one: "Firmware updates have been successfully installed.",
        msg_two:
          "Please close the Mantarray software, power the Mantarray instrument off and on, then restart the Mantarray software.",
        button_names: ["Okay"],
      },
      sw_update_labels: {
        header: "Important!",
        msg_one: "A software update will be installed after exiting.",
        msg_two: "Please wait a few minutes before starting the software again.",
        button_names: ["Okay"],
      },
    };
  },
  computed: {
    ...mapGetters({
      status_uuid: "flask/status_id",
    }),
    ...mapState("stimulation", ["stim_status"]),
    ...mapState("settings", [
      "log_path",
      "shutdown_error_message",
      "total_uploaded_files",
      "total_file_count",
      "beta_2_mode",
      "software_update_available",
      "allow_sw_update_install",
    ]),
  },
  watch: {
    status_uuid: function (newValue) {
      this.set_text_from_state(newValue);
    },
    confirmation_request: function () {
      const sensitive_ops_in_progress =
        this.status_uuid === STATUS.MESSAGE.LIVE_VIEW_ACTIVE ||
        this.status_uuid === STATUS.MESSAGE.RECORDING ||
        this.status_uuid === STATUS.MESSAGE.CALIBRATING ||
        this.stim_status ||
        this.total_uploaded_files.length < this.total_file_count;
      const fw_update_in_progress =
        this.status_uuid === STATUS.MESSAGE.DOWNLOADING_UPDATES ||
        this.status_uuid === STATUS.MESSAGE.INSTALLING_UPDATES;

      if (this.confirmation_request) {
        if (fw_update_in_progress) this.$bvModal.show("fw-closure-warning");
        else if (sensitive_ops_in_progress) this.$bvModal.show("ops-closure-warning");
        else this.handle_confirmation(1);
      }
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
        case STATUS.MESSAGE.CHECKING_FOR_UPDATES:
          this.alert_txt += "Checking for Firmware Updates...";
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
        case STATUS.MESSAGE.UPDATES_NEEDED:
          this.alert_txt += `Firmware Updates Required`;
          break;
        case STATUS.MESSAGE.DOWNLOADING_UPDATES:
          this.alert_txt += `Downloading Firmware Updates...`;
          this.$bvModal.show("fw-updates-in-progress-message");
          break;
        case STATUS.MESSAGE.INSTALLING_UPDATES:
          this.alert_txt += `Installing Firmware Updates...`;
          break;
        case STATUS.MESSAGE.UPDATES_COMPLETE:
          this.alert_txt += `Firmware Updates Complete`;
          this.close_modals_by_id(["fw-updates-in-progress-message", "fw-closure-warning"]);
          this.$bvModal.show("fw-updates-complete-message");
          break;
        case STATUS.MESSAGE.UPDATE_ERROR:
          this.alert_txt += `Error Occurred During Firmware Update`;
          this.$bvModal.show("error-catch"); // TODO could make a customer error message for this
          break;
        case STATUS.MESSAGE.ERROR:
          this.shutdown_request();
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
    handle_confirmation: function (idx) {
      // Tanner (1/19/22): skipping automatic closure cancellation since this method gaurantees
      // send_confirmation will be emitted, either immediately or after closing sw-update-message
      this.close_modals_by_id(["ops-closure-warning", "fw-closure-warning"], false);
      // if a SW update is available, show message before confirming closure
      if (idx === 1 && this.software_update_available && this.allow_sw_update_install) {
        this.$bvModal.show("sw-update-message");
      } else {
        this.$emit("send_confirmation", idx);
      }
    },
    close_modals_by_id: function (ids, auto_cancel_closure = true) {
      for (const id of ids) {
        if (id !== undefined) this.$bvModal.hide(id);
      }
      // Tanner (1/19/22): if one of the closure warning modals is given here while there is an unresolved
      // closure confirmation, need to respond with cancel value. If this step is skipped, need to make sure
      // send_confirmation will definitely be emitted, or the window will essentially be locked open
      if (
        auto_cancel_closure &&
        this.confirmation_request &&
        (ids.includes("ops-closure-warning") || ids.includes("fw-closure-warning"))
      ) {
        this.$emit("send_confirmation", 0);
      }
    },
    close_fw_updates_in_progress_modal: function () {
      this.$bvModal.hide("fw-updates-in-progress-message");
    },
    close_fw_updates_complete_modal: function () {
      this.$bvModal.hide("fw-updates-complete-message");
    },
    close_sw_update_modal: function () {
      this.$bvModal.hide("sw-update-message");
      this.$emit("send_confirmation", 1);
    },
    shutdown_request: async function () {
      const shutdown_url = "http://localhost:4567/shutdown";
      try {
        await Vue.axios.get(shutdown_url);
      } catch (error) {
        return;
      }
    },
  },
};
</script>
<style>
.div__status-bar {
  top: 0px;
  left: 0px;
  width: 287px;
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

/* Center the error-catch pop-up dialog within the viewport */
#error-catch,
#sw-update-message,
#fw-updates-in-progress-message,
#fw-updates-complete-message,
#fw-closure-warning,
#ops-closure-warning {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
