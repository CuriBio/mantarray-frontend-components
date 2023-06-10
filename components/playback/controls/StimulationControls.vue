<template>
  <div class="div__stimulation-controls-container">
    <!-- Tanner (2/1/22): Only need controls block until SVGs are made of all the buttons in this widget and they can be shaded manually when inactive-->
    <div
      v-if="!enable_stim_controls"
      v-b-popover.hover.bottom="controls_block_label"
      title="Stimulation Controls"
      class="div__controls-block"
    />
    <span class="span__additional-controls-header">Stimulation Controls</span>
    <div class="div__border-container">
      <svg class="svg__stimulation-active-button" height="20" width="20">
        <defs>
          <radialGradient id="greenGradient">
            <stop offset="10%" :stop-color="current_gradient[0]" />
            <stop offset="95%" :stop-color="current_gradient[1]" />
          </radialGradient>
        </defs>
        <circle cx="10" cy="10" r="10" fill="url('#greenGradient')" />
      </svg>
      <svg class="svg__stimulation-controls-loop-button" viewBox="0 0 72 72">
        <path
          d="M63.1,42,40,52.9a1.5,1.5,0,0,0-.2,2.5l4.1,2.8A23.7,23.7,0,0,1,12.4,37.1,1.4,1.4,0,0,0,11,35.7H1.6A1.4,1.4,0,0,0,.2,37.1a27.9,27.9,0,0,0,.7,5.8.4.4,0,0,0,0,.5,35.4,35.4,0,0,0,9.7,18A36.2,36.2,0,0,0,36,71.9a35.7,35.7,0,0,0,19.4-5.7L60.8,70A1.4,1.4,0,0,0,63,68.9l2.1-25.5A1.4,1.4,0,0,0,63.1,42Z"
        ></path>
        <path
          d="M71.2,29.2a.5.5,0,0,0,0-.5A35.8,35.8,0,0,0,36.1.2,35.7,35.7,0,0,0,16.7,5.9L11.3,2.1A1.4,1.4,0,0,0,9.1,3.2L7,28.6A1.4,1.4,0,0,0,9,30L32.1,19.2a1.5,1.5,0,0,0,.2-2.5l-4.1-2.9a23.9,23.9,0,0,1,27.2,8.7A23.5,23.5,0,0,1,59.7,35a1.3,1.3,0,0,0,1.4,1.3h9.4a1.5,1.5,0,0,0,1.4-1.5A27.8,27.8,0,0,0,71.2,29.2Z"
        ></path>
      </svg>
      <b-dropdown
        id="start-stim-dropdown"
        variant="link"
        class="b-dropdown__container"
        no-caret
        @show="handle_play_stop"
      >
        <template #button-content>
          <span :class="svg__stimulation_controls_play_stop_button__dynamic_class">
            <div
              v-b-popover.hover.bottom="play_state ? stop_stim_label : start_stim_label"
              :title="play_state ? 'Stop Stimulation' : 'Start Stimulation'"
            >
              <!-- this is here for testing the popover message -->
              <span :id="play_state ? 'stop-popover-msg' : 'start-popover-msg'" style="display: none">{{
                play_state ? stop_stim_label : start_stim_label
              }}</span>
              <FontAwesomeIcon
                class="fontawesome_icon_class"
                :icon="play_state ? ['fa', 'stop-circle'] : ['fa', 'play-circle']"
              />
              <span v-show="is_stim_in_waiting" class="span__start-stop-spinner">
                <FontAwesomeIcon :style="'fill: #ececed;'" :icon="['fa', 'spinner']" pulse />
              </span>
            </div>
          </span>
        </template>
        <div
          v-if="open_start_dropdown"
          class="dropdown-menu"
          aria-labelledby="dropdownMenuButton"
          :style="`display: ${dropdown_display}`"
        >
          <b-dropdown-item-button
            v-for="(option, idx) in start_stim_options"
            id="dropdown_option"
            :key="option"
            href="#"
            :disabled="idx === 1 && !start_rec_and_stim_enabled"
            @click="
              (e) => {
                e.preventDefault();
                handle_dropdown_select(idx);
              }
            "
            >{{ option }}</b-dropdown-item-button
          >
        </div>
      </b-dropdown>
    </div>
    <svg class="svg__waveform-container" viewBox="0 0 62 62">
      <path
        class="svg__waveform-icon"
        d="M30.4,0A30.4,30.4,0,1,0,60.7,30.4,30.4,30.4,0,0,0,30.4,0Zm20,42.1a.9.9,0,0,1-.9.9H11.3a.9.9,0,0,1-.9-.9V18.7a.9.9,0,0,1,.9-.9H49.5a.9.9,0,0,1,.9.9Zm-4.1-9.6H43.6a.9.9,0,0,0-.9.9V38H39.3V22a.9.9,0,0,0-.9-.9H32.7a.9.9,0,0,0-.8.9V32.5H29a.9.9,0,0,0-.9.9V38H24.7V22a.9.9,0,0,0-.8-.9H18.2a.9.9,0,0,0-.9.9V32.5H14.5a.9.9,0,1,0,0,1.8h3.7a.9.9,0,0,0,.9-.9V22.8H23V38.9a.9.9,0,0,0,.9.8H29a.9.9,0,0,0,.9-.8V34.3h2.8a.9.9,0,0,0,.9-.9V22.8h3.9V38.9a.9.9,0,0,0,.9.8h5.2a.9.9,0,0,0,.8-.8V34.3h1.9a.9.9,0,0,0,0-1.8Z"
      />
    </svg>
    <div
      v-b-popover.hover.bottom="configuration_message"
      title="Configuration Check"
      class="div__config-check-container"
    >
      <svg
        class="svg__config-check-container"
        x="0px"
        y="0px"
        viewBox="-10 -10 100 100"
        @click="start_stim_configuration"
      >
        <path
          :class="svg__stimulation_controls_config_check_button__dynamic_class"
          d="M30.9,2.4c15.71,0,28.5,12.79,28.5,28.5c0,15.71-12.79,28.5-28.5,28.5S2.4,46.61,2.4,30.9
	C2.4,15.18,15.18,2.4,30.9,2.4"
        />
        <g>
          <g>
            <g>
              <g>
                <path
                  class="svg__inner-circle"
                  d="M17.26,28.81c1.14,0,2.07,0.93,2.07,2.07c0,1.14-0.93,2.07-2.07,2.07s-2.07-0.93-2.07-2.07
					C15.2,29.73,16.12,28.81,17.26,28.81 M17.26,24.81c-3.35,0-6.07,2.72-6.07,6.07c0,3.35,2.72,6.07,6.07,6.07
					c3.35,0,6.07-2.72,6.07-6.07C23.33,27.52,20.61,24.81,17.26,24.81L17.26,24.81z"
                />
              </g>
            </g>
          </g>
          <g>
            <g>
              <g>
                <path
                  class="svg__inner-circle"
                  d="M45.26,28.81c1.14,0,2.07,0.93,2.07,2.07c0,1.14-0.93,2.07-2.07,2.07s-2.07-0.93-2.07-2.07
					C43.2,29.73,44.12,28.81,45.26,28.81 M45.26,24.81c-3.35,0-6.07,2.72-6.07,6.07c0,3.35,2.72,6.07,6.07,6.07
					c3.35,0,6.07-2.72,6.07-6.07C51.33,27.52,48.61,24.81,45.26,24.81L45.26,24.81z"
                />
              </g>
            </g>
          </g>
        </g>
        <line class="svg__inner-line" x1="11.73" y1="30.87" x2="3.48" y2="30.87" />
        <line class="svg__inner-line" x1="34.8" y1="17.28" x2="21.16" y2="30.91" />
        <line class="svg__inner-line" x1="58.73" y1="30.87" x2="50.48" y2="30.87" />
      </svg>
      <span v-show="config_check_in_progress" class="span__config-check-spinner">
        <FontAwesomeIcon :style="'fill: #ececed;'" :icon="['fa', 'spinner']" pulse />
      </span>
    </div>
    <b-modal
      id="open-circuit-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget :modal_labels="open_circuit_labels" @handle_confirmation="close_warning_modal" />
    </b-modal>
    <b-modal
      id="stim-24hr-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget :modal_labels="timer_warning_labels" @handle_confirmation="close_timer_modal" />
    </b-modal>
    <b-modal
      id="invalid-imported-protocols"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        :modal_labels="invalid_imported_protocols_labels"
        @handle_confirmation="close_invalid_protocol_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapMutations, mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import {
  faPlayCircle as fa_play_circle,
  faStopCircle as fa_stop_circle,
  faSpinner as fa_spinner,
} from "@fortawesome/free-solid-svg-icons";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { VBPopover, BDropdown, BDropdownItemButton } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
Vue.directive("b-dropdown", BDropdown);
Vue.directive("b-dropdown-item-button", BDropdownItemButton);

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
library.add(fa_play_circle, fa_stop_circle, fa_spinner);

// TODO Luci, swap out PNG for SVG once folder becomes available

/**
 * @vue-data {Boolean} play_state - Current play state of stimulation
 * @vue-data {Array} active_gradient - Active gradient colors for icon while stimulation is running
 * @vue-data {Array} inactive_gradient - Inactive gradient colors for icon if stimulation is stopped
 * @vue-data {Array} current_gradient - Dynamically assigned gradient based on when BE recieves start/stop request
 * @vue-event {event} handle_play_stop - Commits corresponding request to state depending on play_state
 */

export default {
  name: "StimulationControls",
  components: {
    FontAwesomeIcon,
    StatusWarningWidget,
  },
  data() {
    return {
      play_state: false,
      active_gradient: ["#19ac8a", "#24524b"],
      inactive_gradient: ["#b7b7b7", "#858585"],
      current_gradient: ["#b7b7b7", "#858585"],
      start_stim_options: ["Start Stimulation Only", "Start Recording and Stimulation"],
      controls_block_label: "Stimulation Controls are disabled until device is Calibrated",
      open_circuit_labels: {
        header: "Warning!",
        msg_one:
          "You are attempting to assign a protocol to a well that an open circuit was previously found in during the configuration check.",
        msg_two: "Please unassign all wells labeled with an open circuit.",
        button_names: ["Okay"],
      },
      timer_warning_labels: {
        header: "Warning!",
        msg_one: "You have been running a stimulation for 24 hours.",
        msg_two:
          "We strongly recommend stopping the stimulation and running another configuration check to ensure the integrity of the stimulation.",
        button_names: ["Continue Anyway", "Stop Stimulation"],
      },

      stim_24hr_timer: null,
      open_start_dropdown: false,
    };
  },
  computed: {
    ...mapState("stimulation", [
      "protocol_assignments",
      "stim_play_state",
      "stim_status",
      "invalid_imported_protocols",
    ]),
    ...mapState("playback", ["playback_state", "enable_stim_controls", "barcodes"]),
    ...mapState("data", ["stimulator_circuit_statuses"]),
    is_start_stop_button_enabled: function () {
      if (this.is_stim_in_waiting) return false;

      if (!this.play_state) {
        // if starting stim make sure initial magnetometer calibration has been completed and
        // no additional calibrations are running, stim checks have completed, there are no short or
        // open circuits, and that there are no other errors with stim lid
        return (
          this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING &&
          this.assigned_open_circuits.length === 0 &&
          this.barcodes.plate_barcode.valid &&
          this.barcodes.stim_barcode.valid &&
          ![
            STIM_STATUS.ERROR,
            STIM_STATUS.NO_PROTOCOLS_ASSIGNED,
            STIM_STATUS.CONFIG_CHECK_NEEDED,
            STIM_STATUS.CONFIG_CHECK_IN_PROGRESS,
            STIM_STATUS.SHORT_CIRCUIT_ERROR,
            STIM_STATUS.CALIBRATION_NEEDED,
          ].includes(this.stim_status)
        );
      }
      // currently, stop button should always be enabled
      return true;
    },
    is_stim_in_waiting: function () {
      return [STIM_STATUS.STARTING, STIM_STATUS.STOPPING].includes(this.stim_status);
    },
    assigned_open_circuits: function () {
      // filter for matching indices
      return this.stimulator_circuit_statuses.filter((well) =>
        Object.keys(this.protocol_assignments).includes(well.toString())
      );
    },
    start_stim_label: function () {
      if (this.stim_status === STIM_STATUS.ERROR || this.stim_status === STIM_STATUS.SHORT_CIRCUIT_ERROR) {
        return "Cannot start a stimulation with error";
      } else if (
        this.stim_status === STIM_STATUS.CONFIG_CHECK_NEEDED ||
        this.stim_status === STIM_STATUS.CONFIG_CHECK_IN_PROGRESS
      ) {
        return "Configuration check needed";
      } else if (!this.barcodes.stim_barcode.valid) {
        return "Must have a valid Stimulation Lid Barcode";
      } else if (!this.barcodes.plate_barcode.valid) {
        return "Must have a valid Plate Barcode";
      } else if (this.stim_status === STIM_STATUS.NO_PROTOCOLS_ASSIGNED) {
        return "No protocols have been assigned";
      } else if (this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING) {
        return "Cannot start stimulation while calibrating instrument";
      } else if (this.assigned_open_circuits.length !== 0) {
        return "Cannot start stimulation with a protocol assigned to a well with an open circuit.";
      } else {
        return "Start Stimulation";
      }
    },
    stop_stim_label: function () {
      // Tanner (7/27/22): there used to be multiple values, so leaving this as a function in case more values get added in future
      return "Stop Stimulation";
    },
    svg__stimulation_controls_play_stop_button__dynamic_class: function () {
      // Tanner (2/1/22): This is only necessary so that the this button is shaded the same as the rest of
      // the stim controls buttons when the controls block is displayed. The button is
      // not actually active here. If the controls block is removed, this branch can likely be removed too.
      return this.is_start_stop_button_enabled || !this.enable_stim_controls
        ? "span__stimulation-controls-play-stop-button--enabled"
        : "span__stimulation-controls-play-stop-button--disabled";
    },
    is_config_check_button_enabled: function () {
      return (
        [STIM_STATUS.CONFIG_CHECK_NEEDED, STIM_STATUS.READY].includes(this.stim_status) &&
        this.barcodes.stim_barcode.valid &&
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
    },
    svg__stimulation_controls_config_check_button__dynamic_class: function () {
      return this.is_config_check_button_enabled || !this.enable_stim_controls
        ? "svg__stimulation-controls-config-check-button--enabled"
        : "svg__stimulation-controls-config-check-button--disabled";
    },
    configuration_message: function () {
      if (!this.barcodes.stim_barcode.valid) {
        return "Must have a valid Stimulation Lid Barcode";
      } else if (
        [
          playback_module.ENUMS.PLAYBACK_STATES.BUFFERING,
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE,
          playback_module.ENUMS.PLAYBACK_STATES.RECORDING,
        ].includes(this.playback_state)
      ) {
        return "Cannot run configuration check while Live View is active.";
      } else if (this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED) {
        return "Cannot run a configuration check while other processes are active.";
      } else if (
        this.stim_status == STIM_STATUS.ERROR ||
        this.stim_status == STIM_STATUS.SHORT_CIRCUIT_ERROR
      ) {
        return "Cannot run a configuration on this stim lid as a short has been detected on it";
      } else if (this.stim_status === STIM_STATUS.NO_PROTOCOLS_ASSIGNED) {
        return "Cannot run configuration check until protocols have been assigned.";
      } else if (this.stim_status == STIM_STATUS.CONFIG_CHECK_NEEDED) {
        return "Start configuration check";
      } else if (this.stim_status == STIM_STATUS.CONFIG_CHECK_IN_PROGRESS) {
        return "Configuration check in progress...";
      } else if (this.stim_status == STIM_STATUS.STIM_ACTIVE) {
        return "Cannot run a configuration check while stimulation is active.";
      } else {
        return "Configuration check complete. Click to rerun.";
      }
    },
    config_check_in_progress: function () {
      return this.stim_status === STIM_STATUS.CONFIG_CHECK_IN_PROGRESS;
    },
    dropdown_display: function () {
      return this.open_start_dropdown ? "flex" : "none";
    },
    start_rec_and_stim_enabled: function () {
      // disable this option if state is already recording
      return this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.RECORDING;
    },

    invalid_imported_protocols_labels: function () {
      return {
        header: "Warning!",
        msg_one:
          "The following protocols were not imported because some values no longer pass current validity checks:",
        msg_two: this.invalid_imported_protocols.join(", "),
        button_names: ["Close"],
      };
    },
  },
  watch: {
    stim_play_state: function () {
      this.current_gradient = this.stim_play_state ? this.active_gradient : this.inactive_gradient;
      this.play_state = this.stim_play_state;
      // anytime stim changes to active state, start timer
      if (this.stim_play_state) this.start_24hr_timer();
    },
    assigned_open_circuits: function (new_val, old_val) {
      if (this.stim_status !== STIM_STATUS.CONFIG_CHECK_COMPLETE && new_val.length > old_val.length)
        this.$bvModal.show("open-circuit-warning");
    },
    invalid_imported_protocols: function () {
      if (this.invalid_imported_protocols.length > 0) this.$bvModal.show("invalid-imported-protocols");
    },
  },
  mounted() {
    document.addEventListener("click", () => {
      this.open_start_dropdown = false;
    });
  },
  methods: {
    ...mapMutations("playback", ["set_start_recording_from_stim"]),
    async handle_play_stop(e) {
      e.preventDefault();

      if (this.is_start_stop_button_enabled) {
        if (this.play_state) {
          this.$store.dispatch(`stimulation/stop_stimulation`);
          clearTimeout(this.stim_24hr_timer); // clear 24 hour timer for next stimulation
        } else {
          this.open_start_dropdown = true;
        }
      }
    },
    async start_stim_configuration() {
      if (this.is_config_check_button_enabled && !this.config_check_in_progress)
        this.$store.dispatch(`stimulation/start_stim_configuration`);
    },
    async close_warning_modal() {
      this.$bvModal.hide("open-circuit-warning");
    },
    async close_timer_modal(idx) {
      this.$bvModal.hide("stim-24hr-warning");
      if (idx === 1) {
        await this.$store.dispatch(`stimulation/stop_stimulation`);
        clearTimeout(this.start_24hr_timer);
      } else this.start_24hr_timer(); // start new timer
    },
    async start_24hr_timer() {
      this.stim_24hr_timer = setTimeout(() => {
        this.$bvModal.show("stim-24hr-warning");
      }, 24 * 60 * 60e3);
    },
    async handle_dropdown_select(idx) {
      // idx 0 = start stim, idx 1 = start rec and stim
      // start recording first if start rec and stim was selected
      if (idx === 1) this.set_start_recording_from_stim(true);
      // else start stim
      else await this.$store.dispatch(`stimulation/create_protocol_message`);
    },
    close_invalid_protocol_modal: function () {
      this.$bvModal.hide("invalid-imported-protocols");
      this.$store.commit("stimulation/set_invalid_imported_protocols", []);
    },
  },
};
</script>
<style>
body {
  user-select: none;
}

.div__stimulation-controls-container {
  position: relative;
  background: black;
  height: 85px;
  width: 287px;
  font-family: Muli;
  padding-left: 20px;
  top: 0px;
  left: 0px;
  overflow: hidden;
}

.div__controls-block {
  position: absolute;
  z-index: 999;
  background: black;
  opacity: 0.7;
  height: 85px;
  width: 287px;
  padding-left: 20px;
  top: 0px;
  left: 0px;
}

.span__additional-controls-header {
  color: rgb(255, 255, 255);
  position: absolute;
  font-size: 16px;
}

.div__border-container {
  position: absolute;
  border: 3px solid rgb(17, 17, 17);
  height: 40px;
  width: 110px;
  top: 35px;
  left: 100px;
  display: grid;
  grid-template-columns: repeat(25%, 4);
  align-items: center;
  justify-items: center;
  padding: 5px;
}

.span__stimulation-controls-play-stop-button--disabled {
  position: relative;
  color: #2f2f2f;
  font-size: 20px;
  left: -13px;
  bottom: 7px;
}

.b-dropdown__container {
  position: relative;
  grid-column: 4;
  height: 29px;
  width: 20px;
}
.dropdown-item {
  font-size: 13px;
  padding: 5px 9px;
}

.dropdown-item:focus {
  background: gray;
}

.dropdown-menu {
  position: fixed;
  padding: 0;
  min-width: 0px;
  display: flex;
  flex-direction: column;
  height: 63px;
  top: 295px;
  left: 182px;
  border: none;
}

.span__start-stop-spinner {
  position: absolute;
  font-size: 20px;
  right: -10px;
  bottom: 28px;
  color: #fff;
  padding-left: 5px;
  background-color: #000;
  opacity: 0.75;
}

.span__stimulation-controls-play-stop-button--enabled {
  position: relative;
  color: #b7b7b7;
  font-size: 20px;
  left: -13px;
  bottom: 7px;
}

.span__stimulation-controls-play-stop-button--enabled:hover {
  color: #ffffff;
  cursor: pointer;
}

.svg__stimulation-controls-loop-button {
  position: relative;
  fill: #b7b7b7;
  height: 20px;
  width: 20px;
  grid-column: 3/4;
}

.svg__stimulation-active-button {
  position: relative;
  color: #b7b7b7;
  grid-column: 2/3;
}

.img__temp-icon {
  cursor: pointer;
  position: relative;
  height: 55px;
}

.img__waveform-icon {
  position: absolute;
  top: 27px;
  height: 60px;
  left: 2px;
}

.fontawesome_icon_class {
  height: 20px;
  width: 20px;
}

.span__config-check-spinner {
  position: absolute;
  font-size: 34px;
  right: 17.5px;
  bottom: 15px;
  width: 45px;
  color: #fff;
  padding-left: 5px;
  background-color: #000;
  opacity: 0.85;
}

.svg__config-check-container {
  height: 67px;
  left: 20px;
}

.div__config-check-container {
  top: 26px;
  left: 60px;
  position: absolute;
}

.svg__waveform-icon {
  fill: #b7b7b7;
}

.svg__waveform-container {
  height: 44px;
  top: 32px;
  right: 4px;
  position: relative;
}

.svg__stimulation-controls-config-check-button--disabled {
  fill: #2f2f2f;
  stroke: #2f2f2f;
  position: relative;
  stroke-width: 6px;
}

.svg__stimulation-controls-config-check-button--enabled {
  fill: #b7b7b7;
  stroke: #b7b7b7;
  position: relative;
  stroke-width: 6px;
  cursor: pointer;
}

.svg__stimulation-controls-config-check-button--enabled:hover {
  fill: #ffffff;
  stroke: #ffffff;
}

.svg__inner-line {
  stroke: black;
  stroke-width: 6;
  fill: none;
}

.svg__inner-circle {
  stroke: black;
  stroke-width: 8;
  fill: none;
}

#open-circuit-warning,
#stim-24hr-warning,
#invalid-imported-protocols {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
