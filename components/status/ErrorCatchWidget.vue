<template>
  <div>
    <div class="div__status-error-catch-background" :style="error_background_cssprops"></div>
    <span class="div_status-error-catch-title-label">An&nbsp;<wbr />error&nbsp;<wbr />occurred. </span>
    <div class="div_status-error-catch-alert-txt" :style="error_catch_alert">
      <p>{{ shutdown_error_message }}</p>
      <textarea
        v-if="installer_link"
        class="textarea__installer-link"
        name="error_file"
        :rows="2"
        cols="75"
        spellcheck="false"
        :value.prop="installer_link"
        :disabled="true"
      ></textarea>
    </div>
    <div class="div_status-email-txt" :style="email_text_cssprops">
      <p>
        Please send the folder shown below to
        <a id="error_contact" href="mailto:support@curibio.com ? subject = Mantarray Error log"
          >support@curibio.com</a
        >
      </p>
    </div>
    <textarea
      class="textarea__error-file-path"
      name="error_file"
      :rows="compute_number_of_rows"
      cols="50"
      spellcheck="false"
      :value.prop="log_filepath"
      :disabled="true"
      :style="textarea__error_cssprops"
    ></textarea>
    <div class="div_status-error-catch-next-step-txt" :style="next_step_cssprops">
      <p>
        Please turn the instrument off, unplug from the PC,<br />
        and then wait 10 seconds before attempting to use again.
      </p>
    </div>
    <div class="div__error-button" :style="error_catch_button_cssprops">
      <ButtonWidget
        :button_widget_width="450"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="['Okay']"
        :enabled_color="'#B7B7B7'"
        :hover_color="['#FFFFFF']"
        @btn-click="process_ok"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { mapState } from "vuex";
export default {
  name: "ErrorCatchWidget",
  components: {
    ButtonWidget,
  },
  props: {
    log_filepath: { type: String, default: "" },
  },
  computed: {
    ...mapState("settings", ["shutdown_error_message", "installer_link"]),
    compute_number_of_rows: function () {
      return Math.ceil(((this.log_filepath.length * 1.0) / 30).toFixed(1));
    },
    error_background_cssprops: function () {
      let height = 250 + this.compute_number_of_rows * 12;
      if (this.installer_link) {
        height += 25;
      }
      return `height: ${height}px;`;
    },
    error_catch_alert: function () {
      const height = this.installer_link ? 130 : 75;
      return `height: ${height}px;`;
    },
    textarea__error_cssprops: function () {
      const top = this.installer_link ? 195 : 145;
      return `height: ${25 + this.compute_number_of_rows * 12}px; top: ${top}px;`;
    },
    next_step_cssprops: function () {
      let top = 180 + this.compute_number_of_rows * 12;
      if (this.installer_link) {
        top += 35;
      }
      return `top: ${top}px;`;
    },
    error_catch_button_cssprops: function () {
      let top = 250 + this.compute_number_of_rows * 12;
      if (this.installer_link) {
        top += 25;
      }
      return `top: ${top}px; left: 0px; position: absolute`;
    },
    email_text_cssprops: function () {
      const top = this.installer_link ? 175 : 107;
      return `top: ${top}px`;
    },
  },
  methods: {
    process_ok: function () {
      this.$emit("ok-clicked");
    },
  },
};
</script>
<style>
a:link {
  color: #b7b7b7;
  background-color: transparent;
  text-decoration: none;
}
a:hover {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}

.div__status-error-catch-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  background: rgb(17, 17, 17);
  width: 450px;
  top: 0px;
  left: 0px;
  visibility: visible;
  z-index: 1;
}

.div_status-error-catch-title-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 450px;
  height: 30px;
  top: 17.3852px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 3;
}
.div_status-error-catch-alert-txt {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 57.6407px;
  left: 0px;
  width: 450px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 5;
  pointer-events: all;
}
.div_status-email-txt {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  left: 0px;
  width: 450px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 5;
  pointer-events: all;
}

.textarea__error-file-path {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  word-break: break-all;
  outline: none;
  color: rgb(183, 183, 183);
  font-family: Courier New;
  position: absolute;
  left: 56px;
  width: 338px;
  background: rgb(17, 17, 17);
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  vertical-align: top;
  text-align: left;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  resize: none;
  z-index: 5;
  pointer-events: all;
}

.textarea__installer-link {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  word-break: break-all;
  outline: none;
  color: rgb(183, 183, 183);
  font-family: Courier New;
  position: absolute;
  top: 59px;
  left: 20px;
  width: 406px;
  background: rgb(17, 17, 17);
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  vertical-align: top;
  text-align: left;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  resize: none;
  z-index: 5;
  pointer-events: all;
}

.div_status-error-catch-next-step-txt {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  left: 0px;
  width: 450px;
  height: 66px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 5;
  pointer-events: all;
}
</style>
