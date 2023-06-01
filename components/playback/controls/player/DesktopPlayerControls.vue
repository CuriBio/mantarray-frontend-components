<template>
  <div class="div__playback-desktop-player-controls">
    <span class="span__playback-desktop-player-controls-text">Record Options</span>
    <div
      id="settings"
      v-b-popover.hover.bottomright="settings_tooltip_text"
      :title="settings_title"
      class="div__playback-desktop-player-controls-settings-button svg__playback-desktop-player-controls-button"
      @click="$bvModal.show('settings-form')"
    >
      <PlayerControlsSettingsButton /><!-- original mockflow ID: id="cmpD237ca46010539bffd0dce8076a207641"-->
    </div>

    <svg
      v-b-popover.hover.bottomright="schedule_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-schedule-button span__playback-desktop-player-controls--available"
      viewBox="0 0 72 72"
      :title="schedule_title"
      @click="$bvModal.show('recording-name-input-prompt-message')"
    >
      <!-- original mockflow ID: id="cmpD5e8bf5701514a91630d619c1a308f43d"-->

      <path
        d="M36,10A26,26,0,1,1,10,36,26.1,26.1,0,0,1,36,10M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0Z"
      ></path>
      <path d="M36,38.7a2.9,2.9,0,0,1-3-3V18.5a3,3,0,0,1,6,0V35.7A2.9,2.9,0,0,1,36,38.7Z"></path>
      <path d="M36,38.9H26.8a3,3,0,0,1-3-3,2.9,2.9,0,0,1,3-3H36a2.9,2.9,0,0,1,3,3A3,3,0,0,1,36,38.9Z"></path>
    </svg>

    <span
      v-show="playback_state === playback_state_enums.CALIBRATING"
      class="svg__playback-desktop-player-controls-button span__playback-desktop-player-controls-calibrating span__playback-desktop-player-controls--active"
    >
      <FontAwesomeIcon :icon="['fa', 'spinner']" pulse />
    </span>

    <svg
      v-b-popover.hover.bottomright="calibrate_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-calibrate-button"
      viewBox="0 0 30 30"
      :class="svg__playback_desktop_player_controls_calibrate_button__dynamic_class"
      :title="calibrate_title"
      @click="on_calibrate_click()"
    >
      <!--original mockflow ID: id="cmpD0c21e73b858601c2f188b0d5a903fcb3" -->
      <path
        d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0Zm8.81,21.29H6.19a10.79,10.79,0,0,1-1.95-5h.88a1.25,1.25,0,1,0,0-2.5H4.24A10.91,10.91,0,0,1,6.52,8.26L7.24,9A1.25,1.25,0,1,0,9,7.21L8.3,6.5a10.74,10.74,0,0,1,5.4-2.25V5.54a1.25,1.25,0,0,0,2.5,0V4.23a10.77,10.77,0,0,1,5.51,2.28l-.84.84a1.26,1.26,0,0,0,.88,2.14,1.29,1.29,0,0,0,.89-.37l.84-.85a10.79,10.79,0,0,1,2.28,5.48h-.88a1.25,1.25,0,1,0,0,2.5h.88A10.79,10.79,0,0,1,23.81,21.29Z"
      ></path>
      <path d="M16.25,15.34V9.8a1.25,1.25,0,0,0-2.5,0v5.54a2.07,2.07,0,1,0,2.5,0Z"></path>
      <ellipse
        v-show="
          playback_state !== playback_state_enums.NEEDS_CALIBRATION &&
          playback_state !== playback_state_enums.CALIBRATING &&
          playback_state !== playback_state_enums.NOT_CONNECTED_TO_INSTRUMENT
        "
        class="ellipse__playback-desktop-player-controls-calibrate-button-indicator"
        cx="24.55"
        cy="24.6"
        rx="5.45"
        ry="5.4"
      >
        <!--the dot-->
      </ellipse>
    </svg>

    <svg
      v-b-popover.hover.bottomright="liveview_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-live-view-button"
      viewBox="0 0 30 30"
      :class="svg__playback_desktop_player_controls_live_view_button__dynamic_class"
      :title="liveview_title"
      @click="on_live_view_click()"
    >
      <!-- original mockflow ID: id="cmpD92d8b2f97846a56d52d1103b34dd8e08"-->
      <path
        d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0Zm0,20c-5.31,0-9.75-4.37-9.75-5.43S9.63,9.66,15,9.66s9.75,3.78,9.75,4.88C24.75,15.38,20.47,20,15,20Z"
      >
        <!-- the surrounding of the eye-->
      </path>
      <path
        class="svg__playback-desktop-player-controls-live-view-button-iris"
        d="M15,10.73A4.27,4.27,0,1,0,19.28,15,4.27,4.27,0,0,0,15,10.73Zm0,6.52a2.25,2.25,0,0,1,0-4.5,2.21,2.21,0,0,1,.68.12,1.12,1.12,0,0,0-.33.8,1.14,1.14,0,0,0,1.14,1.14,1.11,1.11,0,0,0,.71-.26,2.3,2.3,0,0,1,.05.45A2.25,2.25,0,0,1,15,17.25Z"
      >
        <!-- the iris -->
      </path>
    </svg>

    <span
      v-show="playback_state === playback_state_enums.BUFFERING"
      class="svg__playback-desktop-player-controls-button span__playback-desktop-player-controls-buffering span__playback-desktop-player-controls--active"
    >
      <FontAwesomeIcon :icon="['fa', 'spinner']" pulse />
    </span>

    <svg
      v-show="playback_state !== playback_state_enums.RECORDING"
      v-b-popover.hover.bottomright="record_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-record-button svg__playback-desktop-player-controls-record-button--inactive"
      viewBox="0 0 72 72"
      :class="svg__playback_desktop_player_controls_record_button__inactive__dynamic_class"
      :title="record_title"
      @click="on_activate_record_click()"
    >
      <!-- original mockflow ID: id="cmpD065153341d021afab2bfa7dccd1fae68"-->
      <path d="M36,10A26,26,0,1,1,10,36,26.1,26.1,0,0,1,36,10M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0Z">
        <!--Outer circle-->
      </path>
      <path d="M36,21.6A14.4,14.4,0,1,0,50.4,36,14.3,14.3,0,0,0,36,21.6Z">
        <!-- inner circle-->
      </path>
    </svg>
    <svg
      v-show="playback_state === playback_state_enums.RECORDING"
      v-b-popover.hover.bottomright="record_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-record-button svg__playback-desktop-player-controls-record-button--active"
      viewBox="0 0 72 72"
      :class="svg__playback_desktop_player_controls_record_button__active__dynamic_class"
      :title="record_title"
      @click="on_stop_record_click()"
    >
      <!-- original mockflow ID: id="cmpD065153341d021afab2bfa7dccd1fae68"-->
      <path d="M36,10A26,26,0,1,1,10,36,26.1,26.1,0,0,1,36,10M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0Z">
        <!--Outer circle-->
      </path>

      <rect
        class="rect__playback-desktop-player-controls-record-button-inner-rectangle"
        x="21.744"
        y="21.744"
        width="28.488"
        height="28.488"
        rx="3"
      >
        <!-- inner rectangle-->
      </rect>
    </svg>
    <b-modal
      id="settings-form"
      hide-footer
      hide-header
      hide-header-close
      :no-close-on-backdrop="true"
      :static="true"
    >
      <SettingsForm @close_modal="close_settings_modal" />
    </b-modal>
    <!-- TODO Tanner (5/6/22): could probably clean this up a lot by only using a single StatusWarningWidget and changing the modal labels accordingly
     and handling the close behavior accordingly-->
    <b-modal
      id="calibration-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        id="calibration-modal"
        :modal_labels="calibration_modal_labels"
        @handle_confirmation="close_calibration_modal"
      />
    </b-modal>
    <b-modal
      id="fw-update-available-message"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        id="fw-update-available"
        :modal_labels="fw_update_available_labels"
        @handle_confirmation="close_fw_update_available_modal"
      />
    </b-modal>
    <b-modal
      id="user-input-prompt-message"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        id="user-input-prompt"
        :modal_labels="user_input_prompt_labels"
        @handle_confirmation="close_user_input_prompt_modal"
      />
    </b-modal>
    <b-modal
      id="recording-limit-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        id="recording-limit"
        :modal_labels="recording_limit_labels"
        @handle_confirmation="$bvModal.hide('recording-limit-warning')"
      />
    </b-modal>
    <b-modal
      id="recording-name-input-prompt-message"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <RecordingNameInputWidget
        id="recording-name-input-prompt"
        :default_recording_name="default_recording_name"
        @handle_confirmation="close_recording_name_input"
      />
    </b-modal>
    <b-modal
      id="analysis-in-progress-modal"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusSpinnerWidget id="analysis-in-progress" :modal_labels="analysis_in_progress_labels" />
    </b-modal>
    <b-modal
      id="recording-check"
      size="xl"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <RecordingSnapshotWidget
        id="recording-snapshot-widget"
        @close_modal="$bvModal.hide('recording-check')"
      />
    </b-modal>
    <b-modal
      id="recording-snapshot-error"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        :modal_labels="recording_snapshot_error_labels"
        @handle_confirmation="close_rec_snapshot_err_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import playback_module from "@/store/modules/playback";
import { STATUS } from "@/store/modules/flask/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import PlayerControlsSettingsButton from "./PlayerControlsSettingsButton.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlayCircle as fa_play_circle, faSpinner as fa_spinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SettingsForm from "@/components/settings/SettingsForm.vue";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import RecordingNameInputWidget from "@/components/status/RecordingNameInputWidget.vue";
import StatusSpinnerWidget from "@/components/status/StatusSpinnerWidget.vue";
import RecordingSnapshotWidget from "@/components/status/RecordingSnapshotWidget.vue";

import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton, BModal } from "bootstrap-vue";
import { VBPopover } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
Vue.component("BModal", BModal);
Vue.component("BButton", BButton);

const stateObj = playback_module.state();
const vuex_delay = stateObj.tooltips_delay;

const options = {
  BTooltip: {
    delay: {
      show: 400,
      hide: 100,
    },
  },
  BPopover: {
    delay: {
      show: vuex_delay,
      hide: 50,
    },
  },
};

Vue.use(BootstrapVue, { ...options });

library.add(fa_play_circle);
library.add(fa_spinner);

/**
 * @vue-data {String} playback_state_enums - Current state of playback
 * @vue-data {String} settings_title - Tooltips string for settings
 * @vue-data {String} schedule_title - Tooltips string for schedule recordings
 * @vue-data {String} calibrate_title - Tooltips string for calibration
 * @vue-data {String} liveview_title - Tooltips string for live view
 * @vue-data {String} record_title - Tooltips string for recording
 * @vue-data {String} settings_tooltip_text - Tooltips body text for Settings
 * @vue-data {String} schedule_tooltip_text - Tooltips body text for Schedule
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-computed {Boolean} barcodes.plate_barcode.valid - Current value in Vuex store
 * @vue-computed {String} tooltips_delay - Current tooltips delay in Vuex store.
 * @vue-event {String} on_activate_record_click - User activated the record.
 * @vue-event {String} on_stop_record_click - User activated the stop record.
 * @vue-event {String} on_live_view_click - User activated the live view.
 * @vue-event {String} on_calibrate_click - User activated the calibrate.
 * @vue-methods
 */
export default {
  name: "DesktopPlayerControls",
  components: {
    PlayerControlsSettingsButton,
    FontAwesomeIcon,
    SettingsForm,
    StatusWarningWidget,
    StatusSpinnerWidget,
    RecordingNameInputWidget,
    RecordingSnapshotWidget,
  },
  data: function () {
    return {
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES, // Eli (5/8/20): (this seems) needed to give access to the imported playback_module the v-show directives
      settings_title: "Settings",
      schedule_title: "Schedule Recordings",
      calibrate_title: "Calibration",
      liveview_title: "Live View",
      record_title: "Record",
      settings_tooltip_text: "Edit account settings",
      schedule_tooltip_text: "(Not Yet Available)",
      default_recording_name: "",
      recording_timer: null,
      calibration_modal_labels: {
        header: "Warning!",
        msg_one: "Please ensure no plate is present on device and the stimulation lid is not plugged in.",
        msg_two: "Do you wish to continue?",
        button_names: ["Cancel", "Yes"],
      },
      user_input_prompt_labels: {
        header: "Important!",
        msg_one: "Downloading the firmware update requires your user credentials.",
        msg_two: "Please input them to begin the download",
        button_names: ["Okay"],
      },
      recording_limit_labels: {
        header: "Warning!",
        msg_one: "You've reached the maximum recording duration for your current session.",
        msg_two: "Your recording has been stopped.",
        button_names: ["Okay"],
      },
      analysis_in_progress_labels: {
        header: "Important!",
        msg_one: "Data analysis is in progress for the recording snapshot. This won't take long.",
        msg_two: "Do not close the Mantarray software or power off the Mantarray instrument.",
      },
    };
  },
  computed: {
    ...mapState("playback", [
      "playback_state",
      "barcodes",
      "tooltips_delay",
      "start_recording_from_stim",
      "is_recording_snapshot_running",
    ]),
    ...mapState("data", ["recording_snapshot_error"]),
    ...mapState("settings", [
      "auto_upload",
      "beta_2_mode",
      "user_cred_input_needed",
      "firmware_update_available",
      "firmware_update_dur_mins",
      "run_recording_snapshot_default",
    ]),
    ...mapState("stimulation", ["stim_status", "stim_start_time_idx"]),
    ...mapGetters({
      status_uuid: "flask/status_id",
    }),
    is_valid_barcode: function () {
      return this.barcodes.plate_barcode.valid;
    },
    fw_update_available_labels: function () {
      let duration = `${this.firmware_update_dur_mins} minute`;
      if (this.firmware_update_dur_mins !== 1) duration += "s";
      return {
        header: "Important!",
        msg_one: `A firmware update is required for this Mantarray instrument. It will take about ${duration} to complete. Declining it will prevent automatic software updating.`,
        msg_two:
          "If you accept, please make sure there is no stim lid connected to the instrument. Would you like to download and install the update?",
        button_names: ["No", "Yes"],
      };
    },
    calibrate_tooltip_text: function () {
      if (
        this.status_uuid == STATUS.MESSAGE.UPDATES_NEEDED ||
        this.status_uuid == STATUS.MESSAGE.DOWNLOADING_UPDATES ||
        this.status_uuid == STATUS.MESSAGE.INSTALLING_UPDATES ||
        this.status_uuid == STATUS.MESSAGE.UPDATES_COMPLETE ||
        this.status_uuid == STATUS.MESSAGE.UPDATE_ERROR
      ) {
        return "Cannot calibrate during firmware update.";
      }
      if (this.stim_status === STIM_STATUS.CONFIG_CHECK_IN_PROGRESS)
        return "Cannot calibrate while stimulation configuration check is in progress";
      if (this.stim_status === STIM_STATUS.STIM_ACTIVE) {
        return "Cannot calibrate while stimulating";
      }
      if (this.playback_state == this.playback_state_enums.CALIBRATION_NEEDED) {
        return "Calibration needed. Click to calibrate.";
      }
      if (this.playback_state == this.playback_state_enums.CALIBRATED) {
        return "Calibrated. Click to re-calibrate.";
      }
      if (
        this.playback_state == this.playback_state_enums.LIVE_VIEW_ACTIVE ||
        this.playback_state == this.playback_state_enums.BUFFERING ||
        this.playback_state == this.playback_state_enums.RECORDING
      ) {
        return "Cannot calibrate while Live View is active.";
      }
      return "Cannot calibrate while Mantarray is initializing.";
    },
    liveview_tooltip_text: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        return "Click to stop viewing Mantarray data.";
      }
      if (this.playback_state === this.playback_state_enums.RECORDING) {
        return "Must stop recording before deactivating.";
      }
      if (this.stim_status === STIM_STATUS.CONFIG_CHECK_IN_PROGRESS)
        return "Cannot start live view while stimulation configuration check is in progress";
      if (
        this.playback_state === this.playback_state_enums.CALIBRATION_NEEDED ||
        this.playback_state === this.playback_state_enums.CALIBRATING
      ) {
        return "Must calibrate before activating.";
      }
      if (this.playback_state === this.playback_state_enums.CALIBRATED) {
        return this.is_valid_barcode
          ? "Click to begin viewing Mantarray data."
          : "Must have valid Plate Barcode before activating.";
      }
      return "Must initialize before activating.";
    },
    record_tooltip_text: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        return "Click to begin recording data to file.";
      }
      if (this.playback_state === this.playback_state_enums.RECORDING) {
        return "Click to end recording data to file.";
      }
      if (
        this.playback_state === this.playback_state_enums.NEEDS_CALIBRATION ||
        this.playback_state === this.playback_state_enums.CALIBRATION_NEEDED
      ) {
        return "Must be calibrated before recording.";
      }
      if (this.playback_state === this.playback_state_enums.CALIBRATED) {
        return "Must activate Live View before recording.";
      }
      return "Must initialize before recording.";
    },

    svg__playback_desktop_player_controls_record_button__inactive__dynamic_class: function () {
      return {
        "span__playback-desktop-player-controls--available":
          this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE,
      };
    },
    svg__playback_desktop_player_controls_record_button__active__dynamic_class: function () {
      return {
        "span__playback-desktop-player-controls--active":
          this.playback_state === this.playback_state_enums.RECORDING,
      };
    },
    svg__playback_desktop_player_controls_live_view_button__dynamic_class: function () {
      return {
        "span__playback-desktop-player-controls--available":
          this.playback_state === this.playback_state_enums.CALIBRATED &&
          this.is_valid_barcode &&
          this.stim_status !== STIM_STATUS.CONFIG_CHECK_IN_PROGRESS,
        "span__playback-desktop-player-controls--active":
          this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE,
        "span__playback-desktop-player-controls--running-in-background":
          this.playback_state === this.playback_state_enums.RECORDING,
      };
    },
    svg__playback_desktop_player_controls_calibrate_button__dynamic_class: function () {
      return {
        "span__playback-desktop-player-controls--available":
          (this.playback_state === this.playback_state_enums.NEEDS_CALIBRATION ||
            this.playback_state === this.playback_state_enums.CALIBRATED) &&
          this.stim_status !== STIM_STATUS.STIM_ACTIVE &&
          this.stim_status !== STIM_STATUS.CONFIG_CHECK_IN_PROGRESS,
      };
    },
    recording_snapshot_error_labels: function () {
      return {
        header: "Error!",
        msg_one: "An error occurred while running data analysis for the recording snapshot.",
        msg_two: `${this.recording_snapshot_error}. Please recalibrate and try again.`,
        button_names: ["Close"],
      };
    },
  },
  watch: {
    firmware_update_available() {
      if (this.firmware_update_available) this.$bvModal.show("fw-update-available-message");
    },
    user_cred_input_needed() {
      if (this.user_cred_input_needed) this.$bvModal.show("user-input-prompt-message");
    },
    playback_state(new_state) {
      // if live view had to be started from stim studio, then catch it here and then start recording after buffering state. Start recording cannot happen right after starting live view becuase of buffering state
      if (this.start_recording_from_stim) {
        if (new_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
          // // then start stimulation once ensured that live view has started
          if (this.start_recording_from_stim) this.$store.dispatch(`stimulation/create_protocol_message`);
        } else if (new_state === this.playback_state_enums.RECORDING) {
          this.$store.commit("playback/set_start_recording_from_stim", false);
        }
      }
    },
    stim_start_time_idx() {
      if (this.stim_start_time_idx >= 0 && this.start_recording_from_stim) {
        this.on_activate_record_click();
      }
    },
    async start_recording_from_stim(start_rec) {
      // start recording if set to true
      if (start_rec) {
        // first start live view if it isn't already started
        if (this.playback_state === this.playback_state_enums.CALIBRATED) {
          await this.$store.dispatch("playback/start_live_view");
          // else if live view is already active, just start new recording
        } else if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
          this.$store.dispatch(`stimulation/create_protocol_message`);
        }
      } else {
        this.$store.commit("stimulation/set_stim_start_time_idx", null);
      }
    },
    is_recording_snapshot_running(new_state) {
      if (new_state) {
        this.$bvModal.show("analysis-in-progress-modal");
      } else {
        this.$bvModal.hide("analysis-in-progress-modal");
        this.$bvModal.show(this.recording_snapshot_error ? "recording-snapshot-error" : "recording-check");
      }
    },
  },
  methods: {
    on_activate_record_click: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        this.default_recording_name = this.generate_default_recording_name();
        this.start_recording();
      }
    },
    generate_default_recording_name() {
      const barcode = this.barcodes.plate_barcode.value;

      const now = new Date();
      const utc_year = now.getUTCFullYear();
      const utc_month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // UTC Month is zero-based for some reason
      const utc_day = now.getUTCDate().toString().padStart(2, "0");
      const utc_hour = now.getUTCHours().toString().padStart(2, "0");
      const utc_min = now.getUTCMinutes().toString().padStart(2, "0");
      const utc_sec = now.getUTCSeconds().toString().padStart(2, "0");

      const default_name = `${barcode}__${utc_year}_${utc_month}_${utc_day}_${utc_hour}${utc_min}${utc_sec}`;
      return default_name;
    },
    start_recording: function () {
      this.$store.dispatch("playback/start_recording", this.default_recording_name);

      this.recording_timer = setTimeout(() => {
        if (this.playback_state === this.playback_state_enums.RECORDING) {
          this.on_stop_record_click();
          this.$bvModal.show("recording-limit-warning");
        }
      }, 10 * 60e3);
    },
    on_stop_record_click: async function () {
      clearTimeout(this.recording_timer);
      await this.$store.dispatch("playback/stop_recording");
      await this.$store.dispatch("playback/stop_live_view");
      this.$bvModal.show("recording-name-input-prompt-message");

      if (this.auto_upload) {
        this.$store.commit("settings/set_total_file_count");
      }
    },
    on_live_view_click: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        this.$store.dispatch("playback/stop_live_view");
      } else if (
        this.playback_state === this.playback_state_enums.CALIBRATED &&
        this.is_valid_barcode &&
        this.stim_status !== STIM_STATUS.CONFIG_CHECK_IN_PROGRESS
      ) {
        this.$store.dispatch("playback/start_live_view");
      }
    },
    on_calibrate_click: function () {
      if (
        (this.playback_state === this.playback_state_enums.NEEDS_CALIBRATION ||
          this.playback_state === this.playback_state_enums.CALIBRATED) &&
        this.stim_status !== STIM_STATUS.STIM_ACTIVE &&
        this.stim_status !== STIM_STATUS.CONFIG_CHECK_IN_PROGRESS
      ) {
        if (this.beta_2_mode) this.$bvModal.show("calibration-warning");
        else this.$store.dispatch("playback/start_calibration");
      }
    },
    close_settings_modal: function (save) {
      this.$bvModal.hide("settings-form");

      if (save) {
        // this event is used in electron
        this.$emit("save_account_info");
      }
    },
    close_calibration_modal(idx) {
      this.$bvModal.hide("calibration-warning");
      if (idx === 1) this.$store.dispatch("playback/start_calibration");
    },
    close_rec_snapshot_err_modal() {
      this.$bvModal.hide("recording-snapshot-error");
      this.$store.commit("data/set_recording_snapshot_error", false);
    },
    close_fw_update_available_modal(idx) {
      this.$bvModal.hide("fw-update-available-message");
      this.$store.dispatch("settings/send_firmware_update_confirmation", idx === 1);
    },
    close_user_input_prompt_modal() {
      this.$bvModal.hide("user-input-prompt-message");
      this.$bvModal.show("settings-form");
    },
    close_recording_name_input() {
      this.$bvModal.hide("recording-name-input-prompt-message");
    },
  },
};
</script>
<style type="text/css">
.div__playback-desktop-player-controls {
  --span__playback-desktop-player-controls-button--Top: 37px;
  --span__playback-desktop-player-controls-button--LeftmostLeft: 16px;
  --span__playback-desktop-player-controls-button--LeftSeparation: 55.5px;
  height: 81px;
  width: 287px;
  top: 0px;
  left: 0px;
  position: relative;
  background-color: #000000;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  text-align: center;
  color: #2f2f2f;
  fill: #2f2f2f;
}

.span__playback-desktop-player-controls--available {
  color: #b7b7b7;
  fill: #b7b7b7;
}

.span__playback-desktop-player-controls--active {
  color: #ffffff;
  fill: #ffffff;
}

.span__playback-desktop-player-controls-text {
  line-height: 100%;
  position: absolute;
  width: 207px;
  height: 23px;
  left: 11px;
  top: 6px;
  padding: 5px;
  user-select: none;
  font-size: 16px;
  color: #ffffff;
  text-align: left;
}

.svg__playback-desktop-player-controls-button {
  position: absolute;
  top: var(--span__playback-desktop-player-controls-button--Top);
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 30px;
}

.div__playback-desktop-player-controls-settings-button {
  left: var(--span__playback-desktop-player-controls-button--LeftmostLeft);
}

.svg__playback-desktop-player-controls-schedule-button {
  left: calc(
    var(--span__playback-desktop-player-controls-button--LeftmostLeft) +
      var(--span__playback-desktop-player-controls-button--LeftSeparation) * 1
  );
}

.svg__playback-desktop-player-controls-calibrate-button,
.span__playback-desktop-player-controls-calibrating {
  left: calc(
    var(--span__playback-desktop-player-controls-button--LeftmostLeft) +
      var(--span__playback-desktop-player-controls-button--LeftSeparation) * 2
  );
}

.span__playback-desktop-player-controls-calibrating,
.span__playback-desktop-player-controls-buffering {
  z-index: 1;
  /* Ensure that the animation is displayed over the top of the regular icon */
}

.svg__playback-desktop-player-controls-live-view-button,
.span__playback-desktop-player-controls-buffering {
  left: calc(
    var(--span__playback-desktop-player-controls-button--LeftmostLeft) +
      var(--span__playback-desktop-player-controls-button--LeftSeparation) * 3
  );
}

.svg__playback-desktop-player-controls-record-button {
  left: calc(
    var(--span__playback-desktop-player-controls-button--LeftmostLeft) +
      var(--span__playback-desktop-player-controls-button--LeftSeparation) * 4
  );
}

.rect__playback-desktop-player-controls-record-button-inner-rectangle {
  fill: #db2400;
}

.rect__playback-desktop-player-controls-record-button-inner-rectangle:hover {
  fill: #db2400;
}

.span__playback-desktop-player-controls--active .svg__playback-desktop-player-controls-live-view-button-iris,
.span__playback-desktop-player-controls--running-in-background
  .svg__playback-desktop-player-controls-live-view-button-iris,
.ellipse__playback-desktop-player-controls-calibrate-button-indicator {
  fill: #00c46f;
}

.span__playback-desktop-player-controls--active:hover
  .svg__playback-desktop-player-controls-live-view-button-iris:hover,
.span__playback-desktop-player-controls--running-in-background:hover
  .svg__playback-desktop-player-controls-live-view-button-iris:hover,
.ellipse__playback-desktop-player-controls-calibrate-button-indicator:hover {
  fill: #00c46f;
}

.span__playback-desktop-player-controls--available:hover,
.span__playback-desktop-player-controls--active:hover,
.span__playback-desktop-player-controls--active:hover {
  color: #ececed;
  fill: #ececed;
}

* {
  -webkit-font-smoothing: antialiased;
}

.popover {
  border-color: #ececed;
  opacity: 0.95;
}

/* Simple CSS property to make popover title bold */
.popover-header {
  font-weight: 700;
  background-color: #f7f7f7;
  font-size: 12px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}

/* Bootstrap version 4.4.1 the present tip has the .popover property with a property
   font-size: 0.875rem;
   insipite overriding the value in .popover-body with a user defined
   value say font-size: 12px it was observed during testing it was
   getting resolving to a value of 12 * 0.875 ==> 10.5px
   To maintain the ambiance of the design we have set the value to
   componesate this reduction and now .popover-body has the following
   font-size: 14px;
   This results in resolving to a value of 14 * 0.875 ==> 12.25px
   Please note if you intented to change always try to multiple by a
   factor of 0.875 with which ever value to get the real font-size */
.popover-body {
  font-weight: 400;
  color: #000000;
  background-color: #ffffff;
  font-size: 14px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}

.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

#recording-limit-warning,
#calibration-warning,
#user-input-prompt-message,
#fw-update-available-message,
#five-min-warning,
#one-min-warning,
#recording-name-input-prompt-message,
#analysis-in-progress-modal,
#existing-recording-warning,
#recording-snapshot-error {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
#recording-check {
  position: fixed;
  margin: 0%;
  top: 0%;
  left: 0;
  right: 0;
}
#settings-form {
  position: fixed;
  margin: 0%;
  top: 5%;
  left: 0;
  right: 0;
}
</style>
