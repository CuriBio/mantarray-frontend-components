<template>
  <div>
    <!-- original mockflow ID: id="cmpDd7c4156bb0839a33f5be9502418562bf" -->
    <div
      class="div__status-error-catch-background"
      :style="error_background_cssprops"
    ></div>
    <!-- original mockflow ID: id="cmpD94339a6591e3ead19b4308b3a8b0cb68" -->
    <span class="div_status-error-catch-title-label"
      >An&nbsp;<wbr />error&nbsp;<wbr />occurred.
    </span>
    <!-- original mockflow ID: id="cmpD7504e31fab5b6799a0bbf3fe2514622e" -->
    <div class="div_status-error-catch-alert-txt">
      <p>Mantarray software is about to shut down.</p>
      <p>
        Please send this log file to
        <a
          id="error_contact"
          href="mailto:contact@curibio.com ? subject = Mantarray Error log"
          >contact@curibio.com</a
        >
      </p>
    </div>
    <textarea
      class="textarea__error-file-path"
      name="error_file"
      :rows="compute_number_of_rows"
      cols="50"
      spellcheck="false"
      :value.prop="internal_file_full_path"
      :style="textarea__error_cssprops"
    ></textarea>
    <div class="div__error-button" :style="error_catch_button_cssprops">
      <ButtonWidget
        :button_widget_width="450"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_create_plate_map_okay"
        :enabled_color="visiblecolor_create_plate_map_okay"
        :disabled_color="hidecolor_create_plate_map_okay"
        :hover_color="hovercolors_create_plate_map_okay"
        :is_enabled="enablelist_create_plate_map_okay"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";
// import { ButtonWidget } from "@/dist/mantarray.common";
export default {
  name: "ErrorCatchWidget",
  components: {
    ButtonWidget,
  },
  props: {
    log_filepath: { type: String, default: "" },
  },
  data() {
    return {
      internal_file_full_path: this.log_filepath,
    };
  },
  computed: {
    compute_number_of_rows: function () {
      return Math.ceil(((this.log_filepath.length * 1.0) / 50).toFixed(1));
    },
    error_background_cssprops: function () {
      return "height: " + (180 + this.compute_number_of_rows * 12) + "px;";
    },
    textarea__error_cssprops: function () {
      return "height: " + (25 + this.compute_number_of_rows * 10) + "px;";
    },
    error_catch_button_cssprops: function () {
      return (
        "top: " +
        (160 + this.compute_number_of_rows * 12) +
        "px; left: 0px; position: absolute"
      );
    },
  },
  watch: {},
  created() {
    this.btnnames_create_plate_map_okay = ["Okay"];
    this.enablelist_create_plate_map_okay = [true];
    this.visiblecolor_create_plate_map_okay = "#B7B7B7";
    this.hidecolor_create_plate_map_okay = "#3F3F3F";
    this.hovercolors_create_plate_map_okay = ["#FFFFFF"];
  },
  methods: {},
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
  top: 137.6407px;
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
</style>
