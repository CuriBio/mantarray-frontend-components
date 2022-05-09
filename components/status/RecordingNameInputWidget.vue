<template>
  <div>
    <div class="div__recording-name-input-background">
      <span class="span__recording-name-input-label">{{ modal_labels.header }}</span>
      <div id="customer_id" class="div__recording-name-input-box">
        <InputWidget
          :title_label="modal_labels.msg"
          :placeholder="'Recording File Name'"
          :invalid_text="error_message"
          :spellcheck="false"
          :input_width="400"
          :dom_id_suffix="'recording-name'"
          :initial_value="default_recording_name"
          @update:value="check_recording_name($event)"
        ></InputWidget>
      </div>
      <div class="div__confirm-button-container">
        <ButtonWidget
          :button_widget_width="420"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="['Start Recording']"
          :enabled_color="'#B7B7B7'"
          :is_enabled="[is_enabled]"
          :hover_color="['#bd4932', '#19ac8a']"
          @btn-click="handle_click"
        />
      </div>
    </div>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "RecordingNameInputWidget",
  components: { InputWidget, ButtonWidget },
  props: {
    modal_labels: {
      type: Object,
      default() {
        return {
          header: "Important!",
          msg: "Choose a name for this recording.",
        };
      },
    },
    default_recording_name: { type: String, default: "" },
  },
  data: function () {
    return {
      recording_name: this.default_recording_name,
      error_message: "",
    };
  },
  computed: {
    is_enabled: function () {
      return !this.error_message;
    },
  },
  methods: {
    check_recording_name: function (recording_name) {
      this.recording_name = recording_name;
      if (!recording_name) this.error_message = "Please enter a name";
      else this.error_message = "";
    },
    handle_click: function () {
      if (this.is_enabled) this.$emit("handle_confirmation", this.recording_name);
    },
  },
};
</script>
<style scoped>
.div__recording-name-input-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  height: 200px;
  width: 420px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}
.span__recording-name-input-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 420px;
  height: 30px;
  top: 22.385px;
  left: 0px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.div__recording-name-input-box {
  top: 45px;
  left: 8px;
  position: absolute;
  z-index: 24;
}
.div__confirm-button-container {
  top: 150px;
  left: 0px;
  position: absolute;
}
</style>
