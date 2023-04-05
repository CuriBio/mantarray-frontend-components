<template>
  <div>
    <div class="div__status-warning-background" :style="`height: ${dynamic_modal_height}px;`">
      <span class="span__status-warning-label">{{ modal_labels.header }}</span>
      <div ref="message_area" class="span__status-warning-message">
        <p id="p__status_warning_msg1">{{ modal_labels.msg_one }}</p>
        <p v-show="!include_filepath">
          {{ modal_labels.msg_two }}
          <a
            v-if="email_error"
            id="error_contact"
            href="mailto:support@curibio.com ? subject = Short circuit error"
            >support@curibio.com</a
          >
        </p>
        <textarea
          v-show="include_filepath"
          ref="textarea"
          class="textarea__upload-file-path"
          spellcheck="false"
          :value.prop="modal_labels.msg_two"
          :rows="compute_number_of_rows"
          :cols="50"
          :disabled="true"
          :style="`height: ${textarea__dynamic_height}`"
        />
      </div>
      <div class="div__status-warning-button" :style="`top: ${dynamic_modal_height}px;`">
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
    email_error: {
      type: Boolean,
      default: false,
    },
    include_filepath: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    textarea__dynamic_height: function () {
      return this.compute_number_of_rows * 18 + 25;
    },
    compute_number_of_rows: function () {
      return Math.ceil(((this.modal_labels.msg_two.length * 1.0) / 40).toFixed(1));
    },
    dynamic_modal_height: function () {
      const msg_rows = Math.ceil(
        ((this.modal_labels.msg_one.length + this.modal_labels.msg_two.length) / 50).toFixed(1)
      );
      return msg_rows * 18 + 125;
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
  top: 65px;
  left: 21px;
  width: 378px;
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
  left: 0px;
  position: absolute;
}
.textarea__upload-file-path {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  word-wrap: break-word;
  outline: none;
  color: rgb(183, 183, 183);
  font-family: Courier New;
  position: absolute;
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

#error_contact {
  color: rgb(183, 183, 183);
}
</style>
