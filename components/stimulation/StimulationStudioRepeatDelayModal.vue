<template>
  <div class="div__stimulationstudio-current-settings-background">
    <span class="span__stimulationstudio-current-settings-title">{{ get_modal_title }}</span>
    <canvas class="canvas__stimulationstudio-horizontal-line-separator"> </canvas>
    <div class="div__stimulationstudio-body-container">
      <span>{{ get_input_description }}</span>
      <span class="input_container">
        <InputWidget
          :placeholder="'5'"
          :dom_id_suffix="'repeat_delay'"
          :invalid_text="invalid_text"
          :input_width="80"
          :initial_value="current_repeat_delay_input !== null ? current_repeat_delay_input : ''"
          @update:value="input_value = $event"
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

export default {
  name: "StimulationStudioRepeatDelayModal",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    is_enabled_array: {
      type: Array,
      default() {
        return [true, true];
      },
    },
    current_repeat_delay_input: {
      type: String,
      default() {
        return null;
      },
    },
    modal_type: {
      type: String,
      default: "Repeat",
    },
    delay_open_for_edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      input_value: null,
      invalid_text: "",
      button_labels: [],
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
      if (this.modal_type === "Delay") metric_label = "second(s)";
      return metric_label;
    },
  },
  created() {
    this.input_value = this.current_repeat_delay_input;
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
        };
        this.$emit("delay_close", button_label, delay_settings);
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
  right: 100px;
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
  height: 50px;
  top: 110px;
  visibility: visible;
  font-family: Muli;
  font-size: 17px;
  color: rgb(183, 183, 183);
}
</style>
