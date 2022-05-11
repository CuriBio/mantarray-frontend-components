<template>
  <div>
    <div class="div__data-analysis-background" :style="dynamic_modal_height">
      <span class="span__data-analysis-label">{{ header_label }}</span>
      <div ref="message_area" class="span__data-analysis-message">
        <p>{{ msg_one }}</p>
        <textarea
          v-if="is_state_ready"
          class="textarea__recording-dir-path"
          :rows="compute_number_of_rows"
          cols="50"
          spellcheck="false"
          :disabled="true"
          :value.prop="root_recording_path"
        />
      </div>
      <div v-if="is_state_ready" class="div__file-directory-label-container">
        <div v-for="label in ['Recording name:', 'Date created:']" :key="label">
          {{ label }}
        </div>
      </div>
      <div v-if="is_state_ready" class="div__directory-list-container">
        <div
          v-for="rec_name in recordings_list"
          :key="rec_name.creation_date"
          class="div__recording-list-item"
          :class="{ selected_recording: selected_recordings.includes(rec_name) }"
          @click="handle_selected_recordings(rec_name)"
        >
          <div class="div__recording-name-container">{{ rec_name.name }}</div>
          <span>{{ rec_name.creation_time }}</span>
        </div>
      </div>
      <span v-if="!is_state_ready" class="span__data-analysis-spinner">
        <FontAwesomeIcon :icon="['fa', 'spinner']" pulse />
      </span>
      <div v-if="is_state_ready" class="div__data-analysis-button-container">
        <ButtonWidget
          :button_widget_width="700"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="button_names"
          :enabled_color="'#B7B7B7'"
          :hover_color="['#bd4932', '#bd4932', '#19ac8a']"
          :is_enabled="enabled_buttons"
          @btn-click="handle_click"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { mapState } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSpinner as fa_spinner } from "@fortawesome/free-solid-svg-icons";
import { ENUMS } from "@/store/modules/playback/enums";

library.add(fa_spinner);
export default {
  name: "DataAnalysisWidget",
  components: {
    ButtonWidget,
    FontAwesomeIcon,
  },
  data() {
    return {
      selected_recordings: [],
      button_names: ["Cancel", "Reset", "Run"],
      is_state_ready: true,
      enabled_buttons: [true, true, false],
    };
  },
  computed: {
    ...mapState("settings", ["root_recording_path", "recordings_list"]),
    ...mapState("playback", ["data_analysis_state"]),
    compute_number_of_rows: function () {
      return Math.ceil(((this.root_recording_path.length * 1.0) / 30).toFixed(1));
    },
    dynamic_modal_height: function () {
      return this.data_analysis_state == ENUMS.DATA_ANALYSIS_STATE.READY
        ? "height: 450px;"
        : "height: 300px;";
    },
    msg_one: function () {
      return this.is_state_ready
        ? `Please choose from the following recordings found at:`
        : "Please do not shutdown the Mantarray software or unplug Mantarray instrument while analysis is running.";
    },
    header_label: function () {
      return this.is_state_ready ? "Start analysis" : "Running Analysis...";
    },
  },
  watch: {
    selected_recordings: function (new_recs, _) {
      // required to reset the reset feature to false
      this.enabled_buttons = new_recs.length === 0 ? [true, true, false] : [true, true, true];
    },
    data_analysis_state: function (new_state, _) {
      this.is_state_ready = new_state == ENUMS.DATA_ANALYSIS_STATE.READY;
    },
  },
  methods: {
    handle_click: function (idx) {
      if (idx === 0) this.$emit("send_confirmation", { idx, selected_recordings: [] });
      else if (idx === 2 && this.selected_recordings.length > 0) {
        const rec_names = this.selected_recordings.map((rec) => rec.name);
        this.$emit("send_confirmation", { idx, selected_recordings: rec_names });
      }
      this.selected_recordings = [];
    },
    handle_selected_recordings: function (rec_name) {
      // need to check  if recording is already present in stored  list to track if a user is selecting or unselecting an option
      const rec_idx = this.selected_recordings.indexOf(rec_name);
      rec_idx === -1 ? this.selected_recordings.push(rec_name) : this.selected_recordings.splice(rec_idx, 1);
    },
  },
};
</script>
<style scoped>
.div__data-analysis-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 700px;
  top: 0;
  left: 0;
  visibility: visible;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
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
  border-bottom: 2px solid black;
  color: #b7b7b7;
  cursor: pointer;
}
.div__recording-list-item:hover,
.selected_recording {
  background: #2f2f2f;
}
.div__file-directory-label-container {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Muli;
  font-size: 14px;
  color: #b7b7b7;
  background: black;
  width: 600px;
  left: 50px;
  position: absolute;
  top: 170px;
  padding: 0 70px 0 40px;
}
.span__data-analysis-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 700px;
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
.span__data-analysis-message {
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
  width: 640px;
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
.div__data-analysis-button-container {
  left: 0px;
  position: absolute;
  top: 450px;
}
.textarea__recording-dir-path {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  word-break: break-all;
  outline: none;
  color: rgb(183, 183, 183);
  font-family: Courier New;
  width: 420px;
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
}
.div__directory-list-container {
  background: #1c1c1c;
  height: 225px;
  width: 600px;
  left: 50px;
  position: absolute;
  top: 205px;
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

.span__data-analysis-spinner {
  left: 295px;
  position: absolute;
  top: 155px;
}
.fa-pulse {
  font-size: 6em;
  color: grey;
}
</style>
