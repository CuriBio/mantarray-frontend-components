<template>
  <div>
    <div class="div__status-warning-background">
      <span class="span__status-warning-label">{{ modal_labels.header }}</span>
      <div class="span__status-warning-message">
        <p>{{ modal_labels.msg_one }}</p>
        <p v-show="!success_status">{{ modal_labels.msg_two }}</p>
        <textarea
          v-show="success_status"
          class="textarea__error-file-path"
          name="uploaded_file"
          :rows="compute_number_of_rows"
          cols="50"
          spellcheck="false"
          :value.prop="modal_labels.msg_two"
          :style="textarea__error_cssprops"
        />
      </div>
      <div class="div__status-warning-button">
        <ButtonWidget
          :button_widget_width="420"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="modal_labels.button_names"
          :enabled_color="'#B7B7B7'"
          :hover_color="['#bd4932', '#19ac8a']"
          @btn-click="handle_click"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "StatusWarningWidget",
  components: {
    ButtonWidget,
  },
  props: {
    modal_labels: {
      type: Object,
      default() {
        return {
          header: "Warning!",
          msg_one: "Operations are still in progress.",
          msg_two: "Are you sure you want to exit?",
          button_names: ["Cancel", "Yes"],
        };
      },
    },
    success_status: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textarea__error_cssprops: function () {
      return "height: " + (25 + this.compute_number_of_rows * 12) + "px;";
    },
    compute_number_of_rows: function () {
      return Math.ceil(((this.modal_labels.msg_two.length * 1.0) / 40).toFixed(1));
    },
  },
  methods: {
    handle_click: function (idx) {
      this.$emit("handle_confirmation", idx);
    },
  },
};
</script>
<style scoped>
.div__status-warning-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 420px;
  height: 150px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}

.span__status-warning-label {
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
.span__status-warning-message {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 55px;
  left: 21px;
  width: 378px;
  height: 123px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}
.div__status-warning-button {
  top: 150px;
  left: 0px;
  position: absolute;
}
.textarea__error-file-path {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  word-wrap: break-word;
  outline: none;
  color: rgb(183, 183, 183);
  font-family: Courier New;
  position: absolute;
  top: 45px;
  left: 15px;
  width: 338px;
  background: rgb(17, 17, 17);
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  vertical-align: top;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  resize: none;
  z-index: 5;
  pointer-events: all;
}
</style>
