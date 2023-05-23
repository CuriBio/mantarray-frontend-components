<template>
  <div class="div__stimulationstudio-current-settings-background">
    <span class="span__stimulationstudio-current-settings-title"
      >{{ modal_title }}
      <div v-if="include_units" class="div__color-block" :style="color_to_display" />
      <div v-if="include_units" class="div__color-label" @click="$bvModal.show('change-color-modal-two')">
        Change color
      </div></span
    >
    <span>
      <b-modal id="change-color-modal-two" size="sm" hide-footer hide-header hide-header-close :static="true">
        <StimulationStudioColorModal
          :current_color="selected_color"
          @change_pulse_color="change_pulse_color"
        />
      </b-modal>
    </span>
    <canvas class="canvas__stimulationstudio-horizontal-line-separator"> </canvas>
    <div class="div__stimulationstudio-body-container">
      <span>{{ input_label }}</span>
      <span class="input_container">
        <InputWidget
          :placeholder="'0'"
          :dom_id_suffix="'stim-input'"
          :invalid_text="invalid_text"
          :input_width="100"
          :initial_value="current_value !== null ? current_value : ''"
          @update:value="check_validity($event)"
        />
      </span>
      <span v-if="include_units">
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
import StimulationStudioColorModal from "@/components/stimulation/StimulationStudioColorModal.vue";
import { check_delay_pulse_validity } from "@/js_utils/protocol_validation";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

import { BModal } from "bootstrap-vue";
import { VBPopover } from "bootstrap-vue";
Vue.directive("b-popover", VBPopover);
Vue.component("BModal", BModal);
Vue.use(BootstrapVue);
/**
 * @vue-props {String} current_value - Current input if modal is open for editing
 * @vue-props {String} current_unit - The current unit selected when a delay block is opened to edit
 * @vue-props {String} modal_type - Determines if delay or repeat styling is assigned to modal
 * @vue-props {Boolean} modal_open_for_edit - States if delay modal is open for editing
 * @vue-data {String} input_value - Value input into modal
 * @vue-data {String} invalid_text - Validity check for input
 * @vue-computed {Array} button_labels - Button labels for modal
 * @vue-data {Array} is_enabled_array - Array of which buttons should be disabled at base of modal
 * @vue-computed {Array} button_hover_colors - Array of what color the text in the button will be when hovered over
 * @vue-data {Array} time_units - Array of possible options in the unit dropdown menu
 * @vue-data {Int} time_unit_idx - Index of currently selected time unit from dropdown
 * @vue-watch {Boolean} is_valid - True if input passes the validation check and allows Save button to become enabled
 * @vue-data {String} modal_title - Title
 * @vue-data {String} input_description - Subtitle
 * @vue-computed {Array} button_labels - Button array dependent on if its a reedit or not
 * @vue-method {event} close - emits close of modal and data to parent component
 * @vue-method {event} check_validity - checks if inputs are valid numbers only and not empty
 * @vue-method {event} handle_unit_change - Saves current selected index in time unit dropdown
 */

export default {
  name: "StimulationStudioInputModal",
  components: {
    InputWidget,
    ButtonWidget,
    SmallDropDown,
    StimulationStudioColorModal,
  },
  props: {
    current_input: {
      type: String,
      default: null,
    },
    current_unit: {
      type: String,
      default: "milliseconds",
    },
    modal_open_for_edit: {
      type: Boolean,
      default: false,
    },
    current_color: {
      type: String,
      default: "#b7b7b7",
    },
    modal_title: {
      type: String,
      default: "Delay",
    },
    input_label: {
      type: String,
      default: "Duration:",
    },
    include_units: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      current_value: this.current_input,
      input_value: null,
      invalid_text: "Required",
      time_units: ["milliseconds", "seconds", "minutes", "hours"],
      time_unit_idx: 0,
      is_enabled_array: [false, true],
      is_valid: false,
      selected_color: this.current_color,
    };
  },
  computed: {
    button_labels() {
      return this.modal_open_for_edit ? ["Save", "Duplicate", "Delete", "Cancel"] : ["Save", "Cancel"];
    },
    button_hover_colors: function () {
      return this.modal_open_for_edit ? ["#19ac8a", "#19ac8a", "#bd4932", "#bd4932"] : ["#19ac8a", "#bd4932"];
    },
    color_to_display: function () {
      return "background-color: " + this.selected_color;
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

    this.time_unit_idx = this.time_units.indexOf(this.current_unit);
    this.is_enabled_array = this.modal_open_for_edit ? [true, true, true, true] : [false, true];
    if (this.current_value !== null) this.check_validity(this.input_value);
  },
  methods: {
    close(idx) {
      const button_label = this.button_labels[idx];
      const value = +this.input_value;
      if (this.modal_title === "Delay") {
        const unit = this.time_units[this.time_unit_idx];
        const delay_settings = { duration: value, unit };
        this.$emit("input-close", button_label, delay_settings, this.selected_color);
      } else {
        this.$emit("input-close", button_label, value);
      }
    },
    check_validity(value_str) {
      this.current_value = value_str;
      if (this.modal_title === "Delay") {
        const selected_unit = this.time_units[this.time_unit_idx];
        this.invalid_text = check_delay_pulse_validity(value_str, selected_unit);
      } else {
        const is_int = Number.isInteger(+value_str);
        this.invalid_text = !is_int ? "Must be a whole (+) number" : "";
      }

      this.is_valid = this.invalid_text === "";
      // Only want to update inputValue here so it is only ever set to a valid value.
      // This means that if a user enters an invalid value and then presses cancel, the most recent
      // valid value will be committed to the store instead of the invalid value
      if (this.is_valid) this.input_value = +value_str;
    },
    handle_unit_change(idx) {
      this.time_unit_idx = idx;
      this.check_validity(this.current_value);
    },
    change_pulse_color(color) {
      this.$bvModal.hide("change-color-modal-two");
      this.selected_color = color;
    },
  },
};
</script>
<style>
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
  left: calc(863px - 872px);
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

.div__color-block {
  height: 14px;
  width: 14px;
  top: 7px;
  left: 370px;
  position: absolute;
  border: 1px solid rgb(255, 255, 255);
}

.div__color-label {
  font-style: italic;
  color: rgb(255, 255, 255);
  position: absolute;
  font-size: 13px;
  left: 395px;
  top: 5px;
  cursor: pointer;
}

.div__color-label:hover {
  text-decoration: underline;
  cursor: pointer;
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

#change-color-modal-two___BV_modal_backdrop_ {
  background-color: rgb(0, 0, 0, 0);
}

#change-color-modal___BV_modal_backdrop_ {
  background-color: rgb(0, 0, 0, 0);
}

.modal-content {
  background-color: rgb(0, 0, 0, 0);
}

#change-color-modal-two {
  position: fixed;
  top: 10%;
  left: 65%;
  height: 300px;
}
</style>
