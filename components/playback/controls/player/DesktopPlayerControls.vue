<template>
  <div class="div__playback-desktop-player-controls">
    <span class="span__playback-desktop-player-controls-text">Record Options</span>
    <div
      id="settings"
      v-b-popover.hover.bottomright="settings_tooltip_text"
      :title="settings_title"
      class="div__playback-desktop-player-controls-settings-button svg__playback-desktop-player-controls-button"
      @click="open_settings_form()"
    >
      <PlayerControlsSettingsButton /><!-- original mockflow ID: id="cmpD237ca46010539bffd0dce8076a207641"-->
    </div>

    <svg
      v-b-popover.hover.bottomright="schedule_tooltip_text"
      class="svg__playback-desktop-player-controls-button svg__playback-desktop-player-controls-schedule-button span__playback-desktop-player-controls--available"
      viewBox="0 0 72 72"
      :title="schedule_title"
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
    <b-modal id="calibration-warning" size="sm" hide-footer hide-header hide-header-close :static="true">
      <StatusWarningWidget
        id="calibration-modal"
        :modal_labels="calibration_modal_labels"
        @handle_confirmation="close_calibration_modal"
      />
    </b-modal>
    <b-modal id="five-min-warning" size="sm" hide-footer hide-header hide-header-close :static="true">
      <StatusWarningWidget
        id="five-min"
        :modal_labels="time_warning_labels.five"
        :height="warning_modal_height"
        @handle_confirmation="close_five_min_modal"
      />
    </b-modal>
    <b-modal id="one-min-warning" size="sm" hide-footer hide-header hide-header-close :static="true">
      <StatusWarningWidget
        id="one-min"
        :modal_labels="time_warning_labels.one"
        :height="warning_modal_height"
        @handle_confirmation="close_one_min_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import PlayerControlsSettingsButton from "./PlayerControlsSettingsButton.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlayCircle as fa_play_circle, faSpinner as fa_spinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SettingsForm from "@/components/settings/SettingsForm.vue";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";

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
 * @vue-computed {Boolean} is_valid_barcode - Current value in Vuex store
 * @vue-computed {String} tooltips_delay - Current tooltips delay in Vuex store.
 * @vue-event {String} on_activate_record_click - User activated the record.
 * @vue-event {String} on_stop_record_click - User activated the stop record.
 * @vue-event {String} on_live_view_click - User activated the live view.
 * @vue-event {String} on_calibrate_click - User activated the calibrate.
 * @vue-methods
 */
export default {
  name: "DesktopPlayerControls",
  components: { PlayerControlsSettingsButton, FontAwesomeIcon, SettingsForm, StatusWarningWidget },
  data: function () {
    return {
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES, // Eli (5/8/20): (this seems) needed to give access to the imported playback_module the v-show directives
      settings_title: "Settings",
      schedule_title: "Schedule Recordings",
      calibrate_title: "Calibration",
      liveview_title: "Live View",
      record_title: "Record",
      settings_tooltip_text: "Edit customer account",
      schedule_tooltip_text: "(Not Yet Available)",
      calibration_modal_labels: {
        header: "Warning!",
        msg_one: "Please ensure no plate is present on device.",
        msg_two: "Do you wish to continue?",
        button_names: ["Cancel", "Yes"],
      },
      time_warning_labels: {
        one: {
          header: "Warning!",
          msg_one: "Live View has been active for over five minutes",
          msg_two: "Do you wish to continue?",
          button_names: ["No", "Yes"],
        },
        five: {
          header: "Warning!",
          msg_one: "Live View has been active for five minutes",
          msg_two: "Do you wish to continue?",
          button_names: ["No", "Yes"],
        },
      },
      warning_modal_height: 200,
    };
  },
  computed: {
    ...mapState("playback", [
      "playback_state",
      "is_valid_barcode",
      "tooltips_delay",
      "one_min_warning",
      "five_min_warning",
    ]),
    ...mapState("settings", ["customer_index", "auto_upload", "beta_2_mode"]),
    calibrate_tooltip_text: function () {
      if (this.playback_state == this.playback_state_enums.CALIBRATION_NEEDED) {
        return "Calibration needed. Click to calibrate.";
      }
      if (this.playback_state == this.playback_state_enums.CALIBRATED) {
        return "Calibrated. Click to re-calibrate.";
      }
      if (
        this.playback_state == this.playback_state_enums.LIVE_VIEW_ACTIVE ||
        this.playback_state == this.playback_state_enums.RECORDING
      ) {
        return "Cannot calibrate while Mantarray is in use.";
      }
      return "Cannot calibrate while Mantarray initializing.";
    },
    liveview_tooltip_text: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        return "Click to stop viewing Mantarray data.";
      }
      if (this.playback_state === this.playback_state_enums.RECORDING) {
        return "Must stop recording before deactivating.";
      }
      if (this.playback_state === this.playback_state_enums.CALIBRATION_NEEDED) {
        return "Must calibrate before activating.";
      }
      if (this.playback_state === this.playback_state_enums.CALIBRATED) {
        return "Click to begin viewing Mantarray data.";
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
          this.playback_state === this.playback_state_enums.CALIBRATED && this.is_valid_barcode != false,
        "span__playback-desktop-player-controls--active":
          this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE,
        "span__playback-desktop-player-controls--running-in-background":
          this.playback_state === this.playback_state_enums.RECORDING,
      };
    },
    svg__playback_desktop_player_controls_calibrate_button__dynamic_class: function () {
      return {
        "span__playback-desktop-player-controls--available":
          this.playback_state === this.playback_state_enums.NEEDS_CALIBRATION ||
          this.playback_state === this.playback_state_enums.CALIBRATED,
      };
    },
  },
  watch: {
    one_min_warning() {
      if (this.one_min_warning) {
        this.$bvModal.show("one-min-warning");
        this.$store.commit("playback/set_one_min_warning", false); // reset to false to ensure new timer starts
      }
    },
    five_min_warning() {
      if (this.five_min_warning) this.$bvModal.show("five-min-warning");
    },
  },
  methods: {
    on_activate_record_click: function () {
      if (this.customer_index === null) this.open_settings_form();
      else if (
        this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE &&
        this.customer_index !== null
      ) {
        this.$store.dispatch("playback/start_recording");
      }
    },
    on_stop_record_click: function () {
      this.$store.dispatch("playback/stop_recording");
      if (this.auto_upload) {
        this.$store.commit("settings/set_total_file_count");
      }
    },
    on_live_view_click: function () {
      if (this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE) {
        this.$store.dispatch("playback/stop_live_view");
      } else if (
        this.playback_state === this.playback_state_enums.CALIBRATED &&
        this.is_valid_barcode != false
      ) {
        this.$store.dispatch("playback/start_live_view");
      }
    },
    on_calibrate_click: function () {
      if (
        this.playback_state === this.playback_state_enums.NEEDS_CALIBRATION ||
        this.playback_state === this.playback_state_enums.CALIBRATED
      ) {
        if (this.beta_2_mode) this.$bvModal.show("calibration-warning");
        else this.$store.dispatch("playback/start_calibration");
      }
    },
    open_settings_form: function () {
      this.$bvModal.show("settings-form");
    },
    close_settings_modal: function () {
      this.$bvModal.hide("settings-form");
    },
    close_calibration_modal(idx) {
      this.$bvModal.hide("calibration-warning");
      if (idx === 1) this.$store.dispatch("playback/start_calibration");
    },
    close_five_min_modal(idx) {
      this.$bvModal.hide("five-min-warning");

      if (idx === 0) this.$store.dispatch("playback/stop_live_view");
      else this.$store.commit("playback/set_one_min_timer");
    },
    close_one_min_modal(idx) {
      this.$bvModal.hide("one-min-warning");

      if (idx === 0) this.$store.dispatch("playback/stop_live_view");
      else this.$store.commit("playback/set_one_min_timer");
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
  position: absolute;
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
  z-index: 1; /* Ensure that the animation is displayed over the top of the regular icon */
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

#calibration-warning,
#five-min-warning,
#one-min-warning {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
