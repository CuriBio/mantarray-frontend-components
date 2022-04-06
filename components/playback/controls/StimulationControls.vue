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
    <img class="img__waveform-icon" src="@/assets/img/waveform-icon.png" />
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
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
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
  },
  data() {
    return {
      play_state: false,
      active_gradient: ["#19ac8a", "#24524b"],
      inactive_gradient: ["#b7b7b7", "#858585"],
      current_gradient: ["#b7b7b7", "#858585"],
      controls_block_label:
        "Stimulation Controls are disabled until device is Calibrated and a valid Stimulation Lid Barcode has been added",
    };
  },
  computed: {
    ...mapState("stimulation", ["protocol_assignments", "stim_play_state", "stim_status"]),
    ...mapState("playback", ["playback_state", "enable_stim_controls", "barcodes"]),
    is_start_stop_button_enabled: function () {
      // Tanner (11/1/21): need to prevent manually starting/stopping stim while recording until BE can support it. BE may already be able to support stopping stim manually during a recording if needed
      let is_enabled = this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.RECORDING;
      if (!this.play_state) {
        // only need to take these conditions into account when additional controls are enabled and not stimulating
        is_enabled =
          is_enabled &&
          Object.keys(this.protocol_assignments).length !== 0 &&
          this.playback_state !== playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING;
      }
      return is_enabled;
    },
    start_stim_label: function () {
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
      // TODO needs to add error status codes
      if (this.stim_status == STIM_STATUS.CONFIG_CHECK_NEEDED) return "Start configuration check";
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
        const action = this.play_state ? "stop_stimulation" : "create_protocol_message";
        this.$store.dispatch(`stimulation/${action}`);
      }
    },
    async start_stim_configuration() {
      // TODO add in requirement to check is stim barcode is  valid
      if (!this.stim_play_state && this.stim_status !== STIM_STATUS.CONFIGURATION_IN_PROGRESS)
        this.$store.dispatch(`stimulation/start_stim_configuration`);
    },
  },
};
</script>
<style scoped>
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
  height: 20px;
  width: 20px;
}
.span__stimulation-controls-play-stop-button--active {
  position: relative;
  color: #b7b7b7;
  grid-column: 4;
  height: 20px;
  width: 20px;
}
.span__stimulation-controls-play-stop-button--active:hover {
  color: #b7b7b7c9;
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
  bottom: 2px;
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
</style>
