<template>
  <div class="div__stimulationstudio-current-settings-background">
    <span class="span__stimulationstudio-current-settings-title">{{ get_modal_title }}</span>
    <canvas class="canvas__stimulationstudio-horizontal-line-separator"> </canvas>
    <div class="div__stimulationstudio-body-container">
      <span>{{ get_input_description }}</span>
      <span class="input_container">
        <InputWidget
          :placeholder="'15000'"
          :dom_id_suffix="'repeat_delay'"
          :invalid_text="invalid_text"
          :input_width="100"
          :initial_value="current_repeat_delay_input !== null ? current_repeat_delay_input : ''"
          @update:value="check_validity($event)"
        />
      </span>
      <span>{{ get_metric_label }}</span>
    </div>
    <div :class="'button-container'">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="520"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="-1"
        :button_names="get_button_array"
        :hover_color="['#19ac8a', '#bd4932']"
        :is_enabled="is_enabled_array"
        @btn-click="close"
      />
    </div>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

/**
 * @vue-props {String} current_repeat_delay_input - Current input if modal is open for editing
 * @vue-props {String} modal_type - Determines if delay or repeat styling is assigned to modal
 * @vue-props {Boolean} delay_open_for_edit - States if delay modal is open for a reedit
 * @vue-data {String} input_value - Value input into modal
 * @vue-data {String} invalid_text - Validity check for input
 * @vue-data {Array} button_labels - Button labels for modal
 * @vue-data {Array} is_enabled_array - Array of which buttons should be disabled at base of modal
 * @vue-data {Object} invalid_err_msg - Object containing all error messages for validation checks of inputs
 * @vue-data {Boolean} is_valid - True if input passes the validation check and allows Save button to become enabled
 * @vue-computed {String} get_modal_title - Title dependent on if its a repeat or delay modal
 * @vue-computed {String} get_input_description - Subtitle dependent on if its a repeat or delay modal
 * @vue-computed {Array} get_button_array - Button array dependent on if its a reedit or not
 * @vue-computed {String} get_metric_label - Label dependent on if its a repeat or delay modal
 * @vue-method {event} close - emits close of modal and data to parent component
 * @vue-method {event} check_validity - checks if inputs are valid numbers only and not empty
 */

export default {
  name: "StimulationStudioRepeatDelayModal",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    current_repeat_delay_input: {
      type: String,
      default() {
        return null;
      },
    },
    modal_type: {
      type: String,
      required: true,
    },
    delay_open_for_edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      input_value: null,
      invalid_text: "Required",
      button_labels: [],
      invalid_err_msg: {
        num_err: "Must be a (+) number",
        required: "Required",
        valid: "",
      },
      is_enabled_array: [false, true, true],
      is_valid: false,
    };
  },
  computed: {
    get_modal_title() {
      let title;
      if (this.modal_type === "Repeat") title = "Sequence Mode";
      if (this.modal_type === "Delay") title = "Delay";
      return title;
    },
    get_input_description() {
      let description;
      if (this.modal_type === "Repeat") description = "Number of Repeats:";
      if (this.modal_type === "Delay") description = "Duration:";
      return description;
    },
    get_button_array() {
      let button_names;
      if (this.delay_open_for_edit === false) button_names = ["Save", "Cancel"];
      if (this.delay_open_for_edit === true) button_names = ["Save", "Delete", "Cancel"];
      return button_names;
    },
    get_metric_label() {
      let metric_label;
      if (this.modal_type === "Repeat") metric_label = "";
      if (this.modal_type === "Delay") metric_label = "milliseconds";
      return metric_label;
    },
  },
  watch: {
    is_valid() {
      this.is_enabled_array = [this.is_valid, true, true];
    },
  },
  created() {
    this.input_value = this.current_repeat_delay_input;
    if (this.current_repeat_delay_input !== null) this.check_validity(this.input_value);
    this.button_labels = this.get_button_array;
  },
  methods: {
    close(idx) {
      const button_label = this.button_labels[idx];
      if (this.modal_type === "Repeat")
        this.$emit("repeat_close", { button_label, number_of_repeats: this.input_value });
      if (this.modal_type === "Delay") {
        const delay_settings = {
          phase_one_duration: Number(this.input_value),
          phase_one_charge: 0,
          interpulse_duration: 0,
          phase_two_duration: 0,
          phase_two_charge: 0,
        };
        this.$emit("delay_close", button_label, delay_settings);
      }
    },
    check_validity(value) {
      const number_regex = new RegExp("^([0]{1}.{1}[0-9]+|[1-9]{1}[0-9]*.{1}[0-9]+|[0-9]+|0)$");

      if (!number_regex.test(value) && value !== "") {
        this.invalid_text = this.invalid_err_msg.num_err;
        this.is_valid = false;
      } else if (value === "") {
        this.invalid_text = this.invalid_err_msg.required;
        this.is_valid = false;
      } else if (number_regex.test(value) && value !== "") {
        this.invalid_text = this.invalid_err_msg.valid;
        this.input_value = value;
        this.is_valid = true;
      }
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
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 90px;
  top: 95px;
  visibility: visible;
  font-family: Muli;
  font-size: 17px;
  color: rgb(183, 183, 183);
}
</style>
