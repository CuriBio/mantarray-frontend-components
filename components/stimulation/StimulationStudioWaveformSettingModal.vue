<template>
  <div
    id="cmpD2f15f130a7c848b6dfa50e77a7bd35ad"
    class="div__stimulationstudio-current-settings-background"
    :style="pulse_type === 'Monophasic' ? 'height: 550px; margin-top: 100px;' : 'height: 840px;'"
  >
    <span id="cmpD5b2290fff52de686574ddc4481707a03" class="span__stimulationstudio-current-settings-title"
      >{{ pulse_type }}&nbsp;<wbr />Pulse&nbsp;<wbr />Details
    </span>
    <div class="div__color-block" :style="color_to_display" />
    <div class="div__color-label" @click="$bvModal.show('change-color-modal')">Change color</div>
    <span>
      <b-modal id="change-color-modal" size="sm" hide-footer hide-header hide-header-close :static="true">
        <StimulationStudioColorModal
          :current_color="selected_color"
          @change_pulse_color="change_pulse_color"
        />
      </b-modal>
    </span>
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
          :placeholder="'10'"
          :dom_id_suffix="'duration'"
          :invalid_text="err_msgs.phase_one_duration"
          :input_width="142"
          :initial_value="selected_pulse_settings.phase_one_duration.toString()"
          @update:value="check_validity($event, 'phase_one_duration')"
        />
        >
      </span>
    </div>
    <span
      id="cmpDad40b728ec40e75944b1291803f7785b"
      class="span__stimulationstudio-current-settings-label-right"
      :style="'top: 109.5px;'"
      >milliseconds</span
    >
    <span
      id="cmpDf2d0dbfd2edb4ffa3b8615863fa1b9a7"
      class="span__stimulationstudio-current-settings-label-left"
      :style="'top: 179.5px;'"
      >Current</span
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
          :invalid_text="err_msgs.phase_one_charge"
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
      >mA</span
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
            :placeholder="'10'"
            :dom_id_suffix="'interphase'"
            :invalid_text="err_msgs.interphase_interval"
            :input_width="142"
            :initial_value="selected_pulse_settings.interphase_interval.toString()"
            @update:value="check_validity($event, 'interphase_interval')"
          />
        </span>
      </div>
      <span class="span__stimulationstudio-current-settings-label-right" :style="'top: 279.5px;'"
        >milliseconds</span
      >
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
            :placeholder="'10'"
            :dom_id_suffix="'durationtwo'"
            :invalid_text="err_msgs.phase_two_duration"
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
        >milliseconds</span
      >
      <span
        id="cmpDdd1b9fc6423c3af17206292a54489078"
        class="span__stimulationstudio-current-settings-label-left"
        :style="'top: 466.5px;'"
        >Current</span
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
            :invalid_text="err_msgs.phase_two_charge"
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
        >mA</span
      >
    </div>
    <canvas :style="pulse_type === 'Monophasic' ? 'top: 240px;' : 'top: 533px;'" />
    <span
      class="span__stimulationstudio-current-settings-label-left"
      :style="pulse_type === 'Monophasic' ? 'top: 267.5px;' : 'top: 553.5px;'"
      >Pulse Frequency</span
    >
    <div
      class="div__stimulationstudio-input-container"
      :style="pulse_type === 'Monophasic' ? 'top: 253px;' : 'top: 540px;'"
    >
      <span class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="'5'"
          :dom_id_suffix="'pulse-frequency'"
          :invalid_text="err_msgs.pulse_frequency"
          :input_width="142"
          :initial_value="input_pulse_frequency.toString()"
          @update:value="update_frequency($event)"
        />
      </span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-right"
      :style="pulse_type === 'Monophasic' ? 'top: 267.5px;' : 'top: 553.5px;'"
      >Hz</span
    >
    <span
      class="span__stimulationstudio-current-settings-label-left"
      :style="pulse_type === 'Monophasic' ? 'top: 337.5px;' : 'top: 623.5px;'"
      >Active Duration</span
    >
    <div
      class="div__stimulationstudio-input-container"
      :style="pulse_type === 'Monophasic' ? 'top: 323px;' : 'top: 610px;'"
    >
      <span class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="use_num_cycles ? '-' : '1000'"
          :dom_id_suffix="'total-active-duration'"
          :disabled="use_num_cycles"
          :invalid_text="err_msgs.total_active_duration"
          :input_width="142"
          :initial_value="calculated_active_dur.toString()"
          @update:value="update_active_duration($event)"
        />
      </span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-right"
      :style="pulse_type === 'Monophasic' ? 'top: 337.5px;' : 'top:  623.5px'"
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
    <div
      class="div__stimulationstudio-checkbox-container"
      :style="pulse_type === 'Monophasic' ? 'top: 400px;' : 'top:  684px'"
    >
      <CheckBoxWidget
        :checkbox_options="checkbox_options"
        :reset="checkbox_reset"
        :initial_selected="checkbox_state"
        @checkbox-selected="set_use_num_cycles"
      />
      <span>Use Number of Cycles</span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-left"
      :style="pulse_type === 'Monophasic' ? 'top: 446px;' : 'top: 730px;'"
      >Number of Cycles</span
    >
    <div
      class="div__stimulationstudio-input-container"
      :style="pulse_type === 'Monophasic' ? 'top: 430px;' : 'top: 714px;'"
    >
      <span class="span__stimulationstudio-input">
        <InputWidget
          :placeholder="use_num_cycles ? '100' : '-'"
          :dom_id_suffix="'num-cycles'"
          :disabled="!use_num_cycles"
          :invalid_text="err_msgs.num_cycles"
          :input_width="142"
          :initial_value="calculated_num_cycles.toString()"
          @update:value="update_num_cycles($event)"
        />
      </span>
    </div>
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
        :src="require(`@/assets/img/${pulse_type}-diagram-Current.png`)"
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
    <div class="button-container" :style="pulse_type === 'Monophasic' ? 'top: 543px;' : 'top: 790px;'">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="950"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="button_labels"
        :hover_color="button_hover_colors"
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
import CheckBoxWidget from "@/components/basic_widgets/CheckBoxWidget.vue";
import StimulationStudioColorModal from "@/components/stimulation/StimulationStudioColorModal.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBalanceScale, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { VBPopover } from "bootstrap-vue";
import { TIME_CONVERSION_TO_MILLIS } from "@/store/modules/stimulation/enums";
import {
  check_num_cycles_validity,
  check_pulse_charge_validity,
  check_pulse_duration_validity,
  check_active_duration_validity,
  check_pulse_frequency_validity,
  get_max_pulse_duration_for_freq,
  calculate_num_cycles,
} from "@/js_utils/protocol_validation";
import BootstrapVue from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
Vue.directive("b-popover", VBPopover);
Vue.component("BModal", BModal);
Vue.use(BootstrapVue);
Vue.directive("popover", VBPopover);
library.add(faBalanceScale, faQuestionCircle);

/**
 * @vue-props {String} pulse_type - Type of pulse for modal
 * @vue-props {Object} selected_pulse_settings - Settings passed to modal if it's selected to edit
 * @vue-props {Object} selected_pulse_settings - Stim block settings passed to modal if it's selected to edit
 * @vue-props {Object} open_modal_for_edit - Boolean to determine if modal is open with existing settings
 * @vue-data {String} popover_message - Popover for disabled input field on hover of question mark
 * @vue-data {Object} pulse_settings - Model for new inputs to be assigned
 * @vue-data {Object} pulse_settings - Model for new inputs to be assigned
 * @vue-data {Array} is_enabled_array - Array of which buttons should be disabled at base of modal
 * @vue-data {Object} err_msgs - Object containing all initial error messages for inputs
 * @vue-data {Boolean} all_valid - True if all inputs pass the validation check and allows Save button to become enabled
 * @vue-data {Object} time_units - Contains option for dropdown components
 * @vue-data {Integer} delay_interval_idx - Used to input current delay interval setting to dropdown when open for edit
 * @vue-data {Integer} active_duration_idx - Used to input current active duration setting to dropdown when open for edit
 * @vue-computed {String} check_max_type - Computes last label for disabled input field
 * @vue-computed {Array} button_labels - Array of button labels for modal
 * @vue-computed {Array} hovered_button_colors - Array of colors that the text will be when a button is hovered over
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
    CheckBoxWidget,
    StimulationStudioColorModal,
  },
  props: {
    pulse_type: { type: String, default: "Biphasic" },
    modal_open_for_edit: { type: Boolean, default: false },
    selected_pulse_settings: {
      type: Object,
      required: true,
    },
    current_color: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      popover_message: "Not Editable: This data is displayed for informational purposes only.",
      pulse_settings: {},
      err_msgs: {
        phase_one_duration: "",
        phase_one_charge: "",
        interphase_interval: "",
        phase_two_duration: "",
        phase_two_charge: "",
        pulse_frequency: "",
        total_active_duration: "",
        num_cycles: "",
      },
      time_units: ["milliseconds", "seconds", "minutes", "hours"],
      all_valid: false,
      is_enabled_array: [false, true],
      active_duration_idx: 0,
      input_pulse_frequency: "",
      max_pulse_duration_for_freq: 50,
      diagram_keys: {
        Monophasic: ["A. Phase Duration", `B. Phase Current`, "C. Total Active Duration"],
        Biphasic: [
          "A. Phase 1 Duration",
          "B. Phase 1 Current",
          "C. Interphase Interval",
          "D. Phase 2 Duration",
          "E. Phase 2 Current",
          "F. Total Active Duration",
        ],
      },
      calculated_active_dur: "",
      calculated_num_cycles: "",
      num_cycles: "",
      use_num_cycles: false,
      checkbox_options: [{ text: "", value: "use_num_cycles" }],
      checkbox_reset: false,
      checkbox_state: false,
      selected_color: this.current_color,
    };
  },
  computed: {
    total_pulse_duration: function () {
      return this.pulse_type === "Monophasic"
        ? +this.pulse_settings.phase_one_duration
        : +this.pulse_settings.phase_one_duration +
            +this.pulse_settings.phase_two_duration +
            +this.pulse_settings.interphase_interval;
    },
    calculated_delay: function () {
      const total_delay = 1000 - this.input_pulse_frequency * this.total_pulse_duration;
      return total_delay / this.input_pulse_frequency;
    },

    button_hover_colors: function () {
      return this.modal_open_for_edit ? ["#19ac8a", "#19ac8a", "#bd4932", "#bd4932"] : ["#19ac8a", "#bd4932"];
    },
    button_labels: function () {
      return this.modal_open_for_edit ? ["Save", "Duplicate", "Delete", "Cancel"] : ["Save", "Cancel"];
    },
    color_to_display: function () {
      return "background-color: " + this.selected_color;
    },
  },
  watch: {
    all_valid() {
      this.set_is_enabled_array();
    },
  },
  created() {
    // Need to copy these values so that the original values won't be edited in case the user cancels an edit
    this.pulse_settings = JSON.parse(JSON.stringify(this.selected_pulse_settings));

    if (this.pulse_settings.frequency !== 0) this.input_pulse_frequency = this.pulse_settings.frequency;

    const { unit, duration } = this.pulse_settings.total_active_duration;
    this.active_duration_idx = this.time_units.indexOf(unit);

    // Tanner (9/27/22): Currently this modal will always load with use_num_cycles set to false, so need to set these specific values
    this.calculated_active_dur = duration;
    this.update_calculated_num_cycles();
    this.num_cycles = this.calculated_num_cycles;

    for (const input in this.pulse_settings) {
      if (this.pulse_settings !== {}) {
        const value = this.pulse_settings[input];
        this.check_validity(value, input);
      }
    }

    this.check_validity(this.input_pulse_frequency, "pulse_frequency");
    this.check_validity(duration, "total_active_duration");
    this.check_validity(this.num_cycles, "num_cycles");
    this.set_is_enabled_array();
  },
  methods: {
    set_is_enabled_array() {
      // disabled duplicate and save button if not valid inputs
      this.is_enabled_array = this.modal_open_for_edit
        ? [this.all_valid, this.all_valid, true, true]
        : [this.all_valid, true];
    },
    close(idx) {
      const button_label = this.button_labels[idx];
      this.pulse_settings.postphase_interval = this.calculated_delay;
      this.pulse_settings.num_cycles = +this.num_cycles;
      this.pulse_settings.frequency = this.input_pulse_frequency;

      this.$emit("close", button_label, this.pulse_settings, this.selected_color);
    },
    update_frequency(new_value) {
      this.check_validity(new_value, "pulse_frequency");
      this.update_current_calculated_value();
    },
    update_active_duration(new_value) {
      this.check_validity(new_value, "total_active_duration");
      if (!this.use_num_cycles) {
        this.update_calculated_num_cycles();
      }
    },
    update_num_cycles(new_value) {
      this.check_validity(new_value, "num_cycles");
      if (this.use_num_cycles) {
        this.update_calculated_activate_dur();
      }
    },
    update_calculated_activate_dur() {
      const default_value = "";

      const is_num_cycles_missing = this.num_cycles === "";
      const is_freq_missing = this.input_pulse_frequency === "";

      let updated_val;
      if (is_num_cycles_missing && is_freq_missing) {
        // if no values have been entered, return empty string so that the placeholder value is used
        updated_val = "";
      } else if (is_num_cycles_missing || is_freq_missing) {
        // TODO could try checking the error messages here instead
        // if only one of the values needed to calculate the active dur has been entered, return "-"
        updated_val = default_value;
      } else {
        const selected_unit = this.time_units[this.active_duration_idx];

        const duration_in_secs = this.num_cycles / this.input_pulse_frequency;
        const dur_in_selected_units = (duration_in_secs * 1000) / TIME_CONVERSION_TO_MILLIS[selected_unit];

        updated_val = isFinite(dur_in_selected_units) ? dur_in_selected_units : default_value;
      }

      this.calculated_active_dur = updated_val;
    },
    update_calculated_num_cycles() {
      const default_value = "";

      const is_active_dur_missing =
        !this.pulse_settings.total_active_duration ||
        this.pulse_settings.total_active_duration.duration === "";
      const is_freq_missing = this.input_pulse_frequency === "";

      let updated_val;
      if (is_active_dur_missing && is_freq_missing) {
        // if no values have been entered, return empty string so that the placeholder value is used
        updated_val = this.calculated_num_cycles = "";
      } else if (is_active_dur_missing || is_freq_missing) {
        // TODO could try checking the error messages here instead
        // if only one of the values needed to calculate the number of cycles has been entered, return "-"
        updated_val = this.calculated_num_cycles = default_value;
      } else {
        const selected_unit = this.time_units[this.active_duration_idx];
        updated_val = calculate_num_cycles(
          selected_unit,
          this.pulse_settings.total_active_duration,
          this.input_pulse_frequency
        );
      }

      this.calculated_num_cycles = updated_val;
    },
    update_current_calculated_value() {
      if (this.use_num_cycles) {
        this.update_calculated_activate_dur();
      } else {
        this.update_calculated_num_cycles();
      }
    },
    check_validity(value, label) {
      if (label === "num_cycles") {
        this.num_cycles = value;
        this.check_num_cycles();
      } else {
        if (label.includes("phase")) {
          this.pulse_settings[label] = value;
        } else if (label.includes("active")) {
          this.pulse_settings.total_active_duration.duration = value;
        }

        if (label.includes("duration") || label.includes("interval")) {
          this.handle_pulse_duration_validity();
          this.check_active_duration();
        } else if (label.includes("charge")) {
          this.check_charge_validity(value, label);
        } else if (label.includes("frequency")) {
          this.input_pulse_frequency = value;
          this.check_pulse_frequency();
        }
      }
      this.handle_all_valid();
    },
    handle_pulse_duration_validity() {
      this.check_pulse_duration("phase_one_duration");
      if (this.pulse_type === "Biphasic") {
        this.check_pulse_duration("phase_two_duration");
        this.check_pulse_duration("interphase_interval");
      }
    },
    handle_all_valid() {
      for (const msg of Object.values(this.err_msgs)) {
        if (msg !== "") {
          this.all_valid = false;
          return;
        }
      }
      this.all_valid = true;
    },
    check_pulse_duration(label) {
      const value_str = this.pulse_settings[label];
      const is_interphase_dur = label === "interphase_interval";
      this.err_msgs[label] = check_pulse_duration_validity(
        value_str,
        is_interphase_dur,
        this.max_pulse_duration_for_freq,
        this.total_pulse_duration
      );

      const is_valid = this.err_msgs[label] === "";
      if (is_valid) this.pulse_settings[label] = +value_str;
    },
    check_active_duration() {
      const value_str = this.pulse_settings.total_active_duration.duration;
      const selected_unit = this.time_units[this.active_duration_idx];

      this.err_msgs.total_active_duration = check_active_duration_validity(
        value_str,
        selected_unit,
        this.total_pulse_duration
      );
      const is_valid = this.err_msgs.total_active_duration === "";
      if (is_valid) {
        this.pulse_settings.total_active_duration.duration = +value_str;
        this.pulse_settings.total_active_duration.unit = this.time_units[this.active_duration_idx];
      }
    },
    check_pulse_frequency() {
      const value_str = this.input_pulse_frequency;
      const max_pulse_dur_for_freq = get_max_pulse_duration_for_freq(this.input_pulse_frequency);

      this.err_msgs.pulse_frequency = check_pulse_frequency_validity(value_str, max_pulse_dur_for_freq);
      const is_valid = this.err_msgs.pulse_frequency === "";

      if (is_valid) {
        this.input_pulse_frequency = +value_str;
        this.max_pulse_duration_for_freq = max_pulse_dur_for_freq;

        this.handle_pulse_duration_validity(); // Need to recheck pulse dur after a new valid frequency is entered
      }
    },
    check_charge_validity(value_str, label) {
      this.err_msgs[label] = check_pulse_charge_validity(value_str);
      const is_valid = this.err_msgs[label] === "";
      if (is_valid) this.pulse_settings[label] = +value_str;
    },
    check_num_cycles() {
      const num_cycles_as_num = +this.num_cycles;
      this.err_msgs.num_cycles = check_num_cycles_validity(this.num_cycles);
      const is_valid = this.err_msgs.num_cycles === "";

      if (is_valid) this.num_cycles = num_cycles_as_num;
    },
    handle_total_duration_unit_change(idx) {
      this.active_duration_idx = idx;
      this.update_current_calculated_value();
      this.check_active_duration();
      this.handle_all_valid();
    },
    set_use_num_cycles(new_value) {
      this.use_num_cycles = new_value == "use_num_cycles";
      this.update_current_calculated_value();
    },
    change_pulse_color(color) {
      this.$bvModal.hide("change-color-modal");
      this.selected_color = color;
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

.div__stimulationstudio-checkbox-container {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: visible;
  position: absolute;
  width: 213px;
  height: 30px;
  left: calc(900px - 852px);
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

.div__color-block {
  height: 14px;
  width: 14px;
  top: 24px;
  left: 450px;
  position: absolute;
  border: 1px solid rgb(255, 255, 255);
}

.div__color-label {
  font-style: italic;
  color: rgb(255, 255, 255);
  position: absolute;
  font-size: 13px;
  left: 475px;
  top: 22px;
  cursor: pointer;
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
  width: 200px;
  height: 90px;
  left: calc(1031px - 852px);
  visibility: visible;
}

.canvas__biphasic-vertical-divider {
  transform: rotate(90deg);
  left: 170px;
  top: 425px;
  width: 695px;
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
  margin-left: 50px;
  max-width: 260px;
  max-height: 300px;
}

.div__mononphasic-diagram-descriptors {
  top: 430px;
  font-size: 14px;
}

#change-color-modal {
  position: fixed;
  top: 5%;
  left: 30%;
  height: 300px;
}
</style>
