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
      <span :class="svg__stimulation_controls_play_stop_button__dynamic_class" @click="handle_play_stop">
        <div v-if="!play_state" v-b-popover.hover.bottom="start_stim_label" title="Start Stimulation">
          <FontAwesomeIcon class="fontawesome_icon_class" :icon="['fa', 'play-circle']" />
        </div>
        <div v-if="play_state" v-b-popover.hover.bottom="stop_stim_label" title="Stop Stimulation">
          <FontAwesomeIcon class="fontawesome_icon_class" :icon="['fa', 'stop-circle']" />
        </div>
      </span>
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
      class="div__temp-icon-container"
    >
      <img
        src="@/assets/img/temp-controls-icon.png"
        class="img__temp-icon"
        @click="start_stim_configuration"
      />
      <span v-show="config_check_in_progress" class="span__spinner">
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
      <StatusWarningWidget
        :modal_labels="open_circuit_warning_labels"
        @handle_confirmation="close_warning_modal"
      />
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
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
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
import { VBPopover } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
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
      controls_block_label: "Stimulation Controls are disabled until device is Calibrated",
      open_circuit_warning_labels: {
        header: "Warning!",
        msg_one:
          "You are about to start a stimulation with disabled wells due to errors found in the configuration check.",
        msg_two: "Please confirm to continue, otherwise replace stimulation lid and try again.",
        button_names: ["Cancel", "Continue"],
      },
      timer_warning_labels: {
        header: "Warning!",
        msg_one: "You have been running a stimulation for 24 hours.",
        msg_two:
          "We strongly recommend stopping the stimulation and running another configuration check to ensure the integrity of the stimulation.",
        button_names: ["Continue Anyway", "Stop Stimulation"],
      },
      stim_24hr_timer: null,
    };
  },
  computed: {
    ...mapState("stimulation", ["protocol_assignments", "stim_play_state", "stim_status"]),
    ...mapState("playback", ["playback_state", "enable_stim_controls", "barcodes"]),
    ...mapState("data", ["stimulator_circuit_statuses"]),
    is_start_stop_button_enabled: function () {
      // Tanner (11/1/21): need to prevent manually starting/stopping stim while recording until BE can support it. BE may already be able to support stopping stim manually during a recording if needed
      let is_enabled = this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.RECORDING;
      if (!this.play_state) {
        // only need to take these conditions into account when additional controls are enabled and not stimulating
        is_enabled =
          is_enabled &&
          Object.keys(this.protocol_assignments).length !== 0 &&
          this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING &&
          ![
            STIM_STATUS.ERROR,
            STIM_STATUS.CONFIG_CHECK_NEEDED,
            STIM_STATUS.CONFIG_CHECK_IN_PROGRESS,
            STIM_STATUS.SHORT_CIRCUIT_ERR,
          ].includes(this.stim_status);
      }
      return is_enabled;
    },
    start_stim_label: function () {
      if (this.stim_status == STIM_STATUS.ERROR || this.stim_status == STIM_STATUS.SHORT_CIRCUIT_ERR) {
        return "Cannot start a stimulation with error";
      }
      if (
        this.stim_status == STIM_STATUS.CONFIG_CHECK_NEEDED ||
        this.stim_status == STIM_STATUS.CONFIG_CHECK_IN_PROGRESS
      ) {
        return "Configuration check needed";
      }
      if (Object.keys(this.protocol_assignments).length === 0) {
        return "No protocols have been assigned";
      } else if (this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.RECORDING) {
        return "Cannot start stimulation while recording is active";
      } else if (this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING) {
        return "Cannot start stimulation while calibrating instrument";
      } else {
        return "Start Stimulation";
      }
    },
    stop_stim_label: function () {
      if (this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.RECORDING) {
        return "Cannot stop stimulation while recording is active";
      } else {
        return "Stop Stimulation";
      }
    },
    svg__stimulation_controls_play_stop_button__dynamic_class: function () {
      if (!this.enable_stim_controls) {
        // Tanner (2/1/22): This is only necessary so that the this button is shaded the same as the rest of
        // the additional controls buttons when the controls block is displayed. The button is
        // not actually active here. If the controls block is removed, this branch can likely be removed too.
        return "span__stimulation-controls-play-stop-button--active";
      }
      return this.is_start_stop_button_enabled
        ? "span__stimulation-controls-play-stop-button--active"
        : "span__stimulation-controls-play-stop-button--inactive";
    },
    configuration_message: function () {
      if (!this.barcodes.stim_barcode.valid) return "Must have a valid Stimulation Lid Barcode";
      else if (this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED)
        return "Can only run a configuration check if device is calibrated. Please ensure no other processes are running.";
      else if (this.stim_status == STIM_STATUS.ERROR || this.stim_status == STIM_STATUS.SHORT_CIRCUIT_ERR)
        return "Cannot run a configuration check with error";
      else if (this.stim_status == STIM_STATUS.CONFIG_CHECK_NEEDED) return "Start configuration check";
      else if (this.stim_status == STIM_STATUS.CONFIG_CHECK_IN_PROGRESS)
        return "Configuration check in progress";
      else if (this.stim_status == STIM_STATUS.STIM_ACTIVE)
        return "Cannot run a configuration check while stimulation is active";
      else return "Configuration check complete. Click to rerun.";
    },
    config_check_in_progress: function () {
      return this.stim_status === STIM_STATUS.CONFIG_CHECK_IN_PROGRESS;
    },
  },
  watch: {
    stim_play_state: function () {
      this.current_gradient = this.stim_play_state ? this.active_gradient : this.inactive_gradient;
      this.play_state = this.stim_play_state;
    },
  },
  methods: {
    async handle_play_stop() {
      if (this.is_start_stop_button_enabled) {
        if (this.play_state) {
          this.$store.dispatch(`stimulation/stop_stimulation`);
          clearTimeout(this.stim_24hr_timer); // clear 24 hour timer for next stimulation
        } else if (this.stimulator_circuit_statuses.length > 0) this.$bvModal.show("open-circuit-warning");
        else {
          await this.$store.dispatch(`stimulation/create_protocol_message`);
          this.start_24hr_timer();
        }
      }
    },
    async start_stim_configuration() {
      if (
        !this.play_state &&
        ![STIM_STATUS.CONFIG_CHECK_IN_PROGRESS, STIM_STATUS.ERROR, STIM_STATUS.SHORT_CIRCUIT_ERR].includes(
          this.stim_status
        ) &&
        this.barcodes.stim_barcode.valid &&
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      )
        this.$store.dispatch(`stimulation/start_stim_configuration`);
    },
    async close_warning_modal(idx) {
      this.$bvModal.hide("open-circuit-warning");
      if (idx === 1) {
        await this.$store.dispatch(`stimulation/create_protocol_message`);
        this.start_24hr_timer();
      }
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
  },
};
</script>
<style>
body {
  user-select: none;
}
.div__stimulation-controls-container {
  position: absolute;
  background: black;
  height: 85px;
  width: 287px;
  font-family: Muli;
  padding-left: 20px;
  top: 0px;
  left: 0px;
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

.span__stimulation-controls-play-stop-button--inactive {
  position: relative;
  color: #2f2f2f;
  grid-column: 4;
  height: 30px;
  width: 20px;
  font-size: 20px;
}
.span__stimulation-controls-play-stop-button--active {
  position: relative;
  color: #b7b7b7;
  grid-column: 4;
  height: 30px;
  width: 20px;
  font-size: 20px;
}
.span__stimulation-controls-play-stop-button--active:hover {
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
.span__spinner {
  position: absolute;
  font-size: 34px;
  right: 9px;
  bottom: 3px;
  width: 45px;
  color: #ffffff;
  padding-left: 5px;
  background-color: black;
  opacity: 0.9;
}

.div__temp-icon-container {
  cursor: pointer;
  position: absolute;
  top: 29px;
  height: 54px;
  left: 55px;
}
.svg__waveform-icon {
  fill: #b7b7b7;
}
.svg__waveform-icon:hover {
  fill: #ffffff;
}
.svg__waveform-container {
  height: 44px;
  top: 32px;
  right: 4px;
  position: relative;
}
#open-circuit-warning,
#stim-24hr-warning {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
