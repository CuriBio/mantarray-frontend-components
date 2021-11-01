<template>
  <div
    id="cmpD2f15f130a7c848b6dfa50e77a7bd35ad"
    class="div__stimulationstudio-current-settings-background"
    :style="pulse_type === 'Monophasic' ? 'height: 550px; margin-top: 100px;' : 'height: 710px;'"
  >
    <span id="cmpD5b2290fff52de686574ddc4481707a03" class="span__stimulationstudio-current-settings-title"
      >{{ pulse_type }}&nbsp;<wbr />Pulse&nbsp;<wbr />Details</span
    >
    <canvas id="cmpD1bd9abe7f57064ecc21010fe87aa8e0a" :style="'top: 59px; width: 900px'" />
    <span id="cmpD334cd34b00ad111c21b729fee2b1def2" class="span__stimulationstudio-current-settings-sub-title"
      >Phase&nbsp;<wbr />1</span
    >
    <span
      id="cmpD31286f8dd12f44eb6bfea7751c014f90"
      class="span__stimulationstudio-current-settings-label-left"
      :style="'top: 109.5px;'"
      >Stimulus&nbsp;<wbr />Duration</span
    >
    <div
      id="cmpD830cdea88a8752e1fdd278dd0215b99d"
      class="div__stimulationstudio-input-container"
      :style="'top: 96px;'"
    >
      <span id="cmpD830cdea88a8752e1fdd278dd0215b99d_txt" class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="'10 ms'"
          :dom_id_suffix="'duration'"
          :invalid_text="err_msg.phase_one_duration"
          :input_width="142"
          :initial_value="selected_pulse_settings.phase_one_duration.toString()"
          @update:value="check_validity($event, 'phase_one_duration')"
        />
        ></span
      >
    </div>
    <span
      id="cmpDad40b728ec40e75944b1291803f7785b"
      class="span__stimulationstudio-current-settings-label-right"
      :style="'top: 109.5px;'"
      >Balance&nbsp;<wbr />Charge</span
    >
    <span
      id="cmpDf2d0dbfd2edb4ffa3b8615863fa1b9a7"
      class="span__stimulationstudio-current-settings-label-left"
      :style="'top: 179.5px;'"
      >{{ stimulation_type }}</span
    >
    <div
      id="cmpDf6ba8560cb2fbd91276a29c46743e99a"
      class="div__stimulationstudio-input-container"
      :style="'top: 166px;'"
    >
      <span id="cmpDf6ba8560cb2fbd91276a29c46743e99a_txt" class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="'100'"
          :dom_id_suffix="'charge'"
          :invalid_text="err_msg.phase_one_charge"
          :input_width="142"
          :initial_value="selected_pulse_settings.phase_one_charge.toString()"
          @update:value="check_validity($event, 'phase_one_charge')"
        />
      </span>
    </div>
    <span
      id="cmpD7695902a49c6eaeb81d267812f0a90cd"
      class="span__stimulationstudio-current-settings-label-right"
      :style="'top: 179.5px;'"
      >Balance&nbsp;<wbr />Charge</span
    >
    <div v-if="pulse_type === 'Biphasic'">
      <canvas id="cmpDefb479b0caa166978ebed24ab8c44baf" :style="'top: 246px;'" />
      <span
        id="cmpD1258ad074a6b3eb7b8a869173413256d"
        class="span__stimulationstudio-current-settings-label-left"
        :style="'top: 279.5px;'"
        >Interphase&nbsp;<wbr />Interval</span
      >
      <div
        id="cmpD948f417edcd29d68f5801d54232d9431"
        class="div__stimulationstudio-input-container"
        :style="'top: 266px;'"
      >
        <span id="cmpD948f417edcd29d68f5801d54232d9431_txt" class="span__stimulationstudio-input">
          <InputWidget
            :placeholder="'10 ms'"
            :dom_id_suffix="'interphase'"
            :invalid_text="err_msg.interphase_interval"
            :input_width="142"
            :initial_value="selected_pulse_settings.interphase_interval.toString()"
            @update:value="check_validity($event, 'interphase_interval')"
          />
        </span>
      </div>
      <canvas id="cmpDa2bea934b07f6b108e90d5efecf200a3" :style="'top: 346px;'" />
      <span
        id="cmpD25434fb95b0bdb4dd6d951c83f90ad78"
        class="span__stimulationstudio-current-settings-sub-title"
        :style="'top: 353.5px;'"
      >
        Phase&nbsp;<wbr />2</span
      >
      <span
        id="cmpDf5881fe2782d4268a11a2a95a99d21b1"
        class="span__stimulationstudio-current-settings-label-left"
        :style="'top: 396.5px;'"
        >Stimulus&nbsp;<wbr />Duration</span
      >
      <div
        id="cmpD818347e832e1274793ffe2c57a5d0a9c"
        class="div__stimulationstudio-input-container"
        :style="'top: 383px;'"
      >
        <span id="cmpD818347e832e1274793ffe2c57a5d0a9c_txt" class="span__stimulationstudio-input">
          <InputWidget
            :placeholder="'10 ms'"
            :dom_id_suffix="'durationtwo'"
            :invalid_text="err_msg.phase_two_duration"
            :input_width="142"
            :initial_value="selected_pulse_settings.phase_two_duration.toString()"
            @update:value="check_validity($event, 'phase_two_duration')"
          />
        </span>
      </div>
      <span
        id="cmpD470ae881458be847aa3ef17c347d3973"
        class="span__stimulationstudio-current-settings-label-right"
        :style="'top: 396.5px;'"
        >Balance&nbsp;<wbr />Charge</span
      >
      <span
        id="cmpDdd1b9fc6423c3af17206292a54489078"
        class="span__stimulationstudio-current-settings-label-left"
        :style="'top: 466.5px;'"
        >{{ stimulation_type }}</span
      >
      <div
        id="cmpD8ecdf9c4a418509adff741b988ad0676"
        class="div__stimulationstudio-input-container"
        :style="'top: 453px;'"
      >
        <span id="cmpD8ecdf9c4a418509adff741b988ad0676_txt" class="span__stimulationstudio-input">
          <InputWidget
            :placeholder="'-100'"
            :dom_id_suffix="'chargetwo'"
            :invalid_text="err_msg.phase_two_charge"
            :input_width="142"
            :initial_value="selected_pulse_settings.phase_two_charge.toString()"
            @update:value="check_validity($event, 'phase_two_charge')"
          />
        </span>
      </div>
      <span
        id="cmpDbc629158eb67226e3134f41509394ec9"
        class="span__stimulationstudio-current-settings-label-right"
        :style="'top: 466.5px;'"
        >Balance&nbsp;<wbr />Charge</span
      >
    </div>
    <canvas :style="pulse_type === 'Monophasic' ? 'top: 240px;' : 'top: 533px;'" />
    <span
      class="span__stimulationstudio-current-settings-label-left"
      :style="pulse_type === 'Monophasic' ? 'top: 267.5px;' : 'top: 566.5px;'"
      >Pulse Frequency</span
    >
    <div
      class="div__stimulationstudio-input-container"
      :style="pulse_type === 'Monophasic' ? 'top: 253px;' : 'top: 553px;'"
    >
      <span class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="'5'"
          :dom_id_suffix="'pulse-frequency'"
          :invalid_text="err_msg.pulse_frequency"
          :input_width="142"
          :initial_value="input_pulse_frequency.toString()"
          @update:value="check_validity($event, 'pulse_frequency')"
        />
      </span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-right"
      :style="pulse_type === 'Monophasic' ? 'top: 267.5px;' : 'top: 566.5px;'"
      >Hz</span
    >
    <span
      class="span__stimulationstudio-current-settings-label-left"
      :style="pulse_type === 'Monophasic' ? 'top: 337.5px;' : 'top: 636.5px;'"
      >Active Duration</span
    >
    <div
      class="div__stimulationstudio-input-container"
      :style="pulse_type === 'Monophasic' ? 'top: 323px;' : 'top: 623px;'"
    >
      <span class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="'1000'"
          :dom_id_suffix="'total-active-duration'"
          :invalid_text="err_msg.total_active_duration"
          :input_width="142"
          :initial_value="selected_stim_settings.total_active_duration.duration.toString()"
          @update:value="check_validity($event, 'total_active_duration')"
        />
      </span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-right"
      :style="pulse_type === 'Monophasic' ? 'top: 337.5px;' : 'top:  636.5px'"
    >
      <SmallDropDown
        :input_height="25"
        :input_width="100"
        :options_text="time_units"
        :options_idx="active_duration_idx"
        :dom_id_suffix="'time_units'"
        @selection-changed="handle_total_duration_unit_change"
      />
    </span>
    <canvas
      :class="
        pulse_type === 'Monophasic'
          ? 'canvas__monophasic-vertical-divider'
          : 'canvas__biphasic-vertical-divider'
      "
    />
    <div class="div__waveform-preview-title">Waveform Preview</div>
    <div class="div__pulse-diagram-container">
      <img
        :src="require(`@/assets/img/${pulse_type}-diagram.png`)"
        :class="pulse_type === 'Monophasic' ? 'img__mononphasic-diagram' : 'None'"
      />
    </div>
    <div
      class="div__waveform-diagram-descriptors"
      :class="pulse_type === 'Monophasic' ? 'div__mononphasic-diagram-descriptors' : 'None'"
    >
      <span :style="'font-size: 19px; padding-bottom:15px;'">Waveform Key</span>
      <ol id="ul__waveform_list_items" :style="'list-style-type: none; padding: 0px;'">
        <li v-for="key in diagram_keys[pulse_type]" :key="key">{{ key }}</li>
      </ol>
    </div>
    <div class="button-container" :style="pulse_type === 'Monophasic' ? 'top: 543px;' : 'top: 703px;'">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="950"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="button_names"
        :hover_color="['#19ac8a', '#bd4932', '#bd4932']"
        :is_enabled="is_enabled_array"
        @btn-click="close"
      />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBalanceScale, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { VBPopover } from "bootstrap-vue";
Vue.directive("popover", VBPopover);
library.add(faBalanceScale, faQuestionCircle);

/**
 * @vue-props {String} stimulation_type - Current type of stimulation
 * @vue-props {String} pulse_type - Type of pulse for modal
 * @vue-props {Array} button_names - Array of button labels for modal
 * @vue-props {Object} selected_pulse_settings - Settings passed to modal if it's selected to edit
 * @vue-props {Object} selected_stim_settings - Stim block settings passed to modal if it's selected to edit
 * @vue-data {String} popover_message - Popover for disabled input field on hover of question mark
 * @vue-data {Object} pulse_settings - Model for new inputs to be assigned
 * @vue-data {Object} stim_settings - Model for new inputs to be assigned
 * @vue-data {Array} is_enabled_array - Array of which buttons should be disabled at base of modal
 * @vue-data {Object} invalid_err_msg - Object containing all error messages for validation checks of inputs
 * @vue-data {Object} regex - Contains regex for various validity checks
 * @vue-data {Object} err_msg - Object containing all initial error messages for inputs
 * @vue-data {Boolean} all_valid - True if all inputs pass the validation check and allows Save button to become enabled
 * @vue-data {Object} time_units - Contains option for dropdown components
 * @vue-data {Integer} delay_interval_idx - Used to input current delay interval setting to dropdown when open for edit
 * @vue-data {Integer} active_duration_idx - Used to input current active duration setting to dropdown when open for edit
 * @vue-computed {String} check_max_type - Computes last label for disabled input field
 * @vue-method {event} close - emits close of modal and data to parent component
 * @vue-method {event} check_validity - calls appropriate validation checks based on changes to inputs
 * @vue-method {event} handle_all_valid - checks if all inputs are valid numbers only and not empty
 * @vue-method {event} check_pulse_duration - checks if the pulse durations are all positive integers and less than 50ms
 * @vue-method {event} check_active_duration - checks if total duration is greater than entire pulse duration and a positive integer
 * @vue-method {event} check_delay_interval - checks if delay interval is a positive integer
 * @vue-method {event} check_charge_validity - checks if charge is greater than or less than set range for voltage(1200) and current(100)
 * @vue-method {event} handle_total_duration_unit_change - handles change to unit dropdown for total active duration input
 * @vue-method {event} handle_delay_unit_change - handles change to unit dropdown for delay interval input
 */

export default {
  name: "StimulationStudioWaveformSettingModal",
  components: {
    InputWidget,
    ButtonWidget,
    SmallDropDown,
  },
  props: {
    stimulation_type: { type: String, default: "Current (mA)" },
    pulse_type: { type: String, default: "Biphasic" },
    button_names: {
      type: Array,
      default() {
        return ["Save", "Cancel"];
      },
    },
    selected_pulse_settings: {
      type: Object,
      required: true,
    },
    selected_stim_settings: {
      type: Object,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      popover_message: "Not Editable: This data is displayed for informational purposes only.",
      pulse_settings: {},
      stim_settings: {},
      invalid_err_msg: {
        num_err: "Must be a number",
        min_num_err: "Must be a positive number",
        required: "Required",
        max_duration: "Duration must be <= 50ms",
        valid: "",
        max_current: "Must be within +/- 100",
        max_voltage: "Must be within +/- 1200",
        max_frequency: "Must be a positive number <= 10",
      },
      err_msg: {
        phase_one_duration: "",
        phase_one_charge: "",
        interphase_interval: "",
        phase_two_duration: "",
        phase_two_charge: "",
        pulse_frequency: "",
        total_active_duration: "",
      },
      time_units: ["milliseconds", "seconds", "minutes"],
      regex: {
        charge: new RegExp("^-?([0]{1}.{1}[0-9]+|[1-9]{1}[0-9]*.{1}[0-9]+|[0-9]+|0)$"),
        duration: new RegExp("^[0-9][0-9]*d*$"),
      },
      is_enabled_array: [false, true, true],
      all_valid: false,
      active_duration_idx: 0,
      input_pulse_frequency: "",
      diagram_keys: {
        Monophasic: ["A. Phase Duration", `B. Phase ${this.stimulation_type}`, "C. Total Active Duration"],
        Biphasic: [
          `A. Phase 1 ${this.stimulation_type}`,
          "B. Phase 1 Duration",
          "C. Interphase Interval",
          `D. Phase 2 ${this.stimulation_type}`,
          "E. Phase 2 Duration",
          "F. Total Active Duration",
        ],
      },
    };
  },
  computed: {
    total_pulse_duration: function () {
      const { phase_one_duration, phase_two_duration, interphase_interval } = this.pulse_settings;
      return Number(phase_one_duration) + Number(phase_two_duration) + Number(interphase_interval);
    },
    calculated_delay: function () {
      const total_delay = 1000 - this.input_pulse_frequency * this.total_pulse_duration;
      return total_delay / this.input_pulse_frequency;
    },
  },
  watch: {
    all_valid() {
      this.is_enabled_array = [this.all_valid, true, true];
    },
  },
  created() {
    this.pulse_settings = this.selected_pulse_settings;
    this.stim_settings = this.selected_stim_settings;
    if (this.frequency !== 0) this.input_pulse_frequency = this.frequency;

    const { unit, duration } = this.stim_settings.total_active_duration;
    this.active_duration_idx = this.time_units.indexOf(unit);

    if (this.pulse_type === "Monophasic") {
      this.pulse_settings = {
        ...this.pulse_settings,
        interphase_interval: 0,
        phase_two_duration: 0,
        phase_two_charge: 0,
      };
    }

    for (const input in this.pulse_settings) {
      if (this.pulse_settings !== {}) {
        const value = this.pulse_settings[input];
        this.check_validity(value, input);
      }
    }

    this.check_validity(this.input_pulse_frequency, "pulse_frequency");
    this.check_validity(duration, "total_active_duration");
  },
  methods: {
    close(idx) {
      const button_label = this.button_names[idx];
      this.stim_settings.repeat_delay_interval = this.calculated_delay;
      this.$emit("close", button_label, this.pulse_settings, this.stim_settings, this.input_pulse_frequency);
    },
    check_validity(value, label) {
      if (label.includes("phase")) this.pulse_settings[label] = value;
      else if (label.includes("active")) this.stim_settings.total_active_duration.duration = value;

      if (label.includes("duration") || label.includes("interval")) {
        this.check_pulse_duration("phase_one_duration");
        if (this.pulse_type === "Biphasic") {
          this.check_pulse_duration("phase_two_duration");
          this.check_pulse_duration("interphase_interval");
        }
        this.check_active_duration("total_active_duration");
      } else if (label.includes("charge")) {
        this.check_charge_validity(value, label);
      } else if (label.includes("frequency")) {
        this.check_pulse_frequency(value, "pulse_frequency");
      }

      this.handle_all_valid();
    },
    handle_all_valid() {
      const valid_inputs = [];

      for (const input in this.err_msg) {
        if (this.err_msg[input] === "") valid_inputs.push(true);
      }

      this.all_valid = valid_inputs.length === 7;
    },
    check_pulse_duration(label) {
      const value = this.pulse_settings[label];
      const check_pulse_duration = this.total_pulse_duration <= 50;

      if (value === "") this.err_msg[label] = this.invalid_err_msg.required;
      else if (!this.regex.duration.test(value) && value !== "")
        this.err_msg[label] = this.invalid_err_msg.min_num_err;
      else if (!check_pulse_duration) this.err_msg[label] = this.invalid_err_msg.max_duration;
      else if (check_pulse_duration && this.regex.duration.test(value) && value !== "") {
        this.err_msg[label] = this.invalid_err_msg.valid;
        this.pulse_settings[label] = Number(value);
      }
    },
    check_active_duration(label) {
      const value = this.stim_settings.total_active_duration.duration;
      const check_total_duration = value >= this.total_pulse_duration;
      const check_time_unit = this.time_units[this.active_duration_idx] === "milliseconds";

      if (value === "") this.err_msg[label] = this.invalid_err_msg.required;
      else if (
        (!this.regex.duration.test(value) && value !== "") ||
        (!check_total_duration && check_time_unit)
      )
        this.err_msg[label] = `Must be a number >= ${this.total_pulse_duration}ms`;
      else {
        this.err_msg[label] = this.invalid_err_msg.valid;
        this.stim_settings[label].duration = Number(value);
        this.stim_settings[label].unit = this.time_units[this.active_duration_idx];
      }
    },
    check_pulse_frequency(value, label) {
      if (value === "") this.err_msg[label] = this.invalid_err_msg.required;
      else if ((!this.regex.duration.test(value) && value !== "") || value == 0 || value > 10)
        this.err_msg[label] = this.invalid_err_msg.max_frequency;
      else if (this.regex.duration.test(value) && value !== "") {
        this.err_msg[label] = this.invalid_err_msg.valid;
        this.input_pulse_frequency = Number(value);
      }
    },
    check_charge_validity(value, label) {
      if (!this.regex.charge.test(value) && value !== "") this.err_msg[label] = this.invalid_err_msg.num_err;
      else if (value === "") this.err_msg[label] = this.invalid_err_msg.required;
      else if (this.stimulation_type.includes("C") && (-100 > value || 100 < value))
        this.err_msg[label] = this.invalid_err_msg.max_current;
      else if (this.stimulation_type.includes("V") && (-1200 > value || 1200 < value))
        this.err_msg[label] = this.invalid_err_msg.max_voltage;
      else if (this.regex.charge.test(value) && value !== "") {
        this.err_msg[label] = this.invalid_err_msg.valid;
        this.pulse_settings[label] = Number(value);
      }
    },
    handle_total_duration_unit_change(idx) {
      this.active_duration_idx = idx;
      this.check_active_duration("total_active_duration");
      this.handle_all_valid();
    },
  },
};
</script>
<style scoped>
.div__stimulationstudio-current-settings-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 950px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 5;
  pointer-events: all;
}

.span__stimulationstudio-current-settings-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 500px;
  height: 30px;
  top: calc(72px - 55px);
  left: calc(863px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

canvas {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  left: calc(878px - 854px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}

.span__stimulationstudio-current-settings-sub-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 499px;
  height: 30px;
  top: calc(122.5px - 55px);
  left: calc(863px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.button-container {
  left: -1px;
  position: absolute;
  cursor: pointer;
}

.span__stimulationstudio-current-settings-label-left {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: visible;
  position: absolute;
  width: 156px;
  height: 30px;
  left: calc(873px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.span__stimulationstudio-current-settings-label-right {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 128px;
  height: 25px;
  left: calc(1195.28px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 4;
}
.span__stimulationstudio-input {
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 90px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
}

.div__stimulationstudio-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 190px;
  height: 90px;
  left: calc(1031px - 852px);
  visibility: visible;
}

.canvas__biphasic-vertical-divider {
  transform: rotate(90deg);
  left: 220px;
  top: 375px;
  width: 600px;
}

.canvas__monophasic-vertical-divider {
  transform: rotate(90deg);
  left: 300px;
  top: 300px;
  width: 440px;
}

.div__pulse-diagram-container {
  position: absolute;
  left: 540px;
  top: 110px;
}
.div__waveform-preview-title {
  position: absolute;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
  left: 650px;
  top: calc(122.5px - 50px);
}

.div__waveform-diagram-descriptors {
  position: absolute;
  height: 150px;
  left: 560px;
  top: 470px;
  width: 370px;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}

.img__mononphasic-diagram {
  width: 350px;
  margin-left: 10px;
}

.div__mononphasic-diagram-descriptors {
  top: 430px;
  font-size: 14px;
}
</style>
