<template>
  <div class="div__stimulationstudio-current-settings-background">
    <span class="span__stimulationstudio-current-settings-title">{{ modal_title }}</span>
    <canvas class="canvas__stimulationstudio-horizontal-line-separator"> </canvas>
    <div class="div__stimulationstudio-body-container">
      <span>{{ input_description }}</span>
      <span class="input_container">
        <InputWidget
          :placeholder="'0'"
          :dom_id_suffix="'delay'"
          :invalid_text="invalid_text"
          :input_width="100"
          :initial_value="current_value !== null ? current_value : ''"
          @update:value="check_validity($event)"
        />
      </span>
      <span>
        <SmallDropDown
          :options_text="time_units"
          :options_idx="time_unit_idx"
          :input_height="25"
          :input_width="100"
          :dom_id_suffix="'delay_block'"
          @selection-changed="handle_unit_change"
        />
      </span>
    </div>
    <div :class="'button-container'">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="520"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="-1"
        :button_names="button_labels"
        :hover_color="button_hover_colors"
        :is_enabled="is_enabled_array"
        @btn-click="close"
      />
    </div>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import { MAX_SUBPROTOCOL_DURATION_MS } from "@/store/modules/stimulation/enums";

/**
 * @vue-props {String} current_value - Current input if modal is open for editing
 * @vue-props {String} current_delay_unit - The current unit selected when a delay block is opened to edit
 * @vue-props {String} modal_type - Determines if delay or repeat styling is assigned to modal
 * @vue-props {Boolean} modal_open_for_edit - States if delay modal is open for editing
 * @vue-data {String} input_value - Value input into modal
 * @vue-data {String} invalid_text - Validity check for input
 * @vue-computed {Array} button_labels - Button labels for modal
 * @vue-data {Array} is_enabled_array - Array of which buttons should be disabled at base of modal
 * @vue-computed {Array} button_hover_colors - Array of what color the text in the button will be when hovered over
 * @vue-data {Array} time_units - Array of possible options in the unit dropdown menu
 * @vue-data {Int} time_unit_idx - Index of currently selected time unit from dropdown
 * @vue-data {Object} invalid_err_msg - Object containing all error messages for validation checks of inputs
 * @vue-watch {Boolean} is_valid - True if input passes the validation check and allows Save button to become enabled
 * @vue-data {String} modal_title - Title
 * @vue-data {String} input_description - Subtitle
 * @vue-computed {Array} button_labels - Button array dependent on if its a reedit or not
 * @vue-method {event} close - emits close of modal and data to parent component
 * @vue-method {event} check_validity - checks if inputs are valid numbers only and not empty
 * @vue-method {event} handle_unit_change - Saves current selected index in time unit dropdown
 */

export default {
  name: "StimulationStudioDelayModal",
  components: {
    InputWidget,
    ButtonWidget,
    SmallDropDown,
  },
  props: {
    current_delay_input: {
      type: String,
      default: null,
    },
    current_delay_unit: {
      type: String,
      default: "milliseconds",
    },
    modal_open_for_edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      current_value: this.current_delay_input,
      input_value: null,
      invalid_text: "Required",
      invalid_err_msg: {
        num_err: "Must be a (+) number",
        required: "Required",
        valid: "",
        max_duration: "Duration must be <= 1hr",
      },
      time_units: ["milliseconds", "seconds"],
      time_unit_idx: 0,
      is_enabled_array: [false, true],
      is_valid: false,
      modal_title: "Delay",
      input_description: "Duration:",
    };
  },
  computed: {
    button_labels() {
      return this.modal_open_for_edit ? ["Save", "Duplicate", "Delete", "Cancel"] : ["Save", "Cancel"];
    },
    button_hover_colors: function () {
      return this.modal_open_for_edit ? ["#19ac8a", "#19ac8a", "#bd4932", "#bd4932"] : ["#19ac8a", "#bd4932"];
    },
  },
  watch: {
    is_valid() {
      // disabled duplicate and save button if not valid inputs
      this.is_enabled_array = this.modal_open_for_edit
        ? [this.is_valid, this.is_valid, true, true]
        : [this.is_valid, true];
    },
  },
  created() {
    this.input_value = this.current_value;
    this.time_unit_idx = this.time_units.indexOf(this.current_delay_unit);
    this.is_enabled_array = this.modal_open_for_edit ? [true, true, true, true] : [false, true];
    if (this.current_value !== null) this.check_validity(this.input_value);
  },
  methods: {
    close(idx) {
      const button_label = this.button_labels[idx];
      const unit_converstion = {
        milliseconds: 1,
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
      };

      const selected_unit = this.time_units[this.time_unit_idx];
      const converted_input = Number(this.input_value) * unit_converstion[selected_unit];
      const delay_settings = {
        phase_one_duration: converted_input,
        phase_one_charge: 0,
        interphase_interval: 0,
        phase_two_duration: 0,
        phase_two_charge: 0,
      };

      const stim_settings = {
        repeat_delay_interval: 0,
        total_active_duration: {
          duration: Number(this.input_value),
          unit: selected_unit,
        },
      };

      const frequency = 1;

      this.$emit("delay_close", button_label, delay_settings, stim_settings, frequency);
    },
    check_validity(value) {
      const number_regex = new RegExp("^([0]{1}.{1}[0-9]+|[1-9]{1}[0-9]*.{1}[0-9]+|[0-9]+|0)$");

      this.current_value = value;

      if (value === "") {
        this.invalid_text = this.invalid_err_msg.required;
      } else if (!number_regex.test(value)) {
        this.invalid_text = this.invalid_err_msg.num_err;
      } else if (this.get_dur_in_ms(value) > MAX_SUBPROTOCOL_DURATION_MS) {
        this.invalid_text = this.invalid_err_msg.max_duration;
      } else {
        this.invalid_text = this.invalid_err_msg.valid;
        // Only want to update input_value here so it is only ever set to a valid value.
        // This means that if a user enters an invalid value and then presses cancel, the most recent
        // valid value will be committed to the store instead of the invalid value
        this.input_value = value;
      }

      this.is_valid = this.invalid_text === this.invalid_err_msg.valid;
    },
    get_dur_in_ms(value) {
      return this.time_units[this.time_unit_idx] === "milliseconds" ? value : value * 1000;
    },
    handle_unit_change(idx) {
      this.time_unit_idx = idx;
      this.check_validity(this.current_value);
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
  width: 522px;
  height: 250px;
  top: calc(55px - 55px);
  left: calc(852px - 852px);
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 5;
  pointer-events: all;
  display: flex;
  justify-content: center;
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

.canvas__stimulationstudio-horizontal-line-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: calc(104px - 45px);
  left: calc(878px - 852px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}

.button-container {
  top: 210px;
  left: 0;
  position: absolute;
  cursor: pointer;
}

.input_container {
  position: relative;
  bottom: 25px;
  right: 120px;
  margin-left: 140px;
}

.div__stimulationstudio-body-container {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 100%;
  transform: rotate(0deg);
  position: relative;
  width: 100%;
  height: 90px;
  top: 95px;
  visibility: visible;
  font-family: Muli;
  font-size: 17px;
  color: rgb(183, 183, 183);
  z-index: 5;
}
</style>
