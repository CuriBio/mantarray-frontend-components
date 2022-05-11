<template>
  <div>
    <div class="div__data-analysis-background" :style="`height: ${dynamic_modal_height}`">
      <span class="span__data-analysis-label">{{ header }}</span>
      <div class="div__data-analysis-message">
        <p>{{ analysis_success_stat }}</p>
        <p>The data can be found at:</p>
        <textarea
          ref="textarea"
          class="textarea__upload-file-path"
          spellcheck="false"
          :value.prop="data_analysis_directory"
          :rows="compute_number_of_rows"
          :cols="70"
          :disabled="true"
          :style="`height: ${textarea__dynamic_height}`"
        />
      </div>
      <p v-if="failed_recordings.length > 0" class="p__failed-recording-label">{{ msg_three }}</p>
      <div v-if="failed_recordings.length > 0" class="div__recording-list-container">
        <div v-for="rec_name in failed_recordings" :key="rec_name.name" class="div__recording-list-item">
          <div class="div__recording-name-container">{{ rec_name.name }}</div>
        </div>
      </div>
      <div class="div__data-analysis-button" :style="`top: ${dynamic_modal_height}`">
        <ButtonWidget
          :button_widget_width="550"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="button_names"
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
import { mapState } from "vuex";

export default {
  name: "DataAnalysisCompleteWidget",
  components: {
    ButtonWidget,
  },
  data: function () {
    return {
      header: "Analysis Complete!",
      msg_three: "The following recordings failed to complete. Please try again.",
      button_names: ["Close"],
    };
  },
  computed: {
    ...mapState("settings", [
      "failed_recordings",
      "data_analysis_directory",
      "selected_recordings_for_analysis",
    ]),
    textarea__dynamic_height: function () {
      return this.compute_number_of_rows * 18 + 25;
    },
    compute_number_of_rows: function () {
      return Math.ceil(((this.data_analysis_directory.length * 1.0) / 40).toFixed(1));
    },
    dynamic_modal_height: function () {
      return this.failed_recordings.length > 0 ? "500px" : "250px";
    },
    analysis_success_stat: function () {
      const successful_analyses =
        this.selected_recordings_for_analysis.length - this.failed_recordings.length;
      return `${successful_analyses}/${this.selected_recordings_for_analysis.length} recordings have been completed successfully.`;
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
.div__data-analysis-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 550px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.span__data-analysis-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: relative;
  width: 500px;
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
.div__data-analysis-message {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  height: 200px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: relative;
  top: 45px;
  width: 400px;
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
.p__failed-recording-label {
  position: relative;
  text-align: center;
  font-size: 15px;
  font-family: Muli;
  color: rgb(183, 183, 183);
}
.div__data-analysis-button {
  left: 0px;
  position: absolute;
}
.div__recording-list-item {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  font-family: Muli;
  font-size: 14px;
  color: #b7b7b7;
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
.div__recording-list-container {
  background: #1c1c1c;
  height: 180px;
  width: 450px;
  position: relative;
  overflow-y: scroll;
}
.div__recording-name-container {
  max-width: 300px;
  overflow-x: scroll;
  padding-top: 10px;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  height: 10px;
  overflow: visible;
  cursor: pointer;
}
::-webkit-scrollbar-thumb {
  background-color: #2f2f2f;
  overflow: visible;
  cursor: pointer;
}
::-webkit-scrollbar-track {
  overflow: visible;
  cursor: pointer;
}
</style>
