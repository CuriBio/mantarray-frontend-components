<template>
  <div>
    <button
      v-b-popover.hover.bottom="analysis_tooltip_text"
      title="Run Data Analysis"
      :class="dynamic_button_class"
      @click="check_analysis_requirements"
    >
      Select Recordings...
    </button>
    <b-modal
      id="start-data-analysis"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <DataAnalysisWidget @send_confirmation="close_analysis_modal" />
    </b-modal>
    <b-modal
      id="no-recordings-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        :include_filepath="true"
        :modal_labels="warning_modal_labels"
        @handle_confirmation="$bvModal.hide('no-recordings-warning')"
      />
    </b-modal>
    <b-modal
      id="data-analysis-complete"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <DataAnalysisCompleteWidget
        @handle_confirmation="close_analysis_complete_modal('data-analysis-complete')"
      />
    </b-modal>
    <b-modal
      id="data-analysis-error"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        :modal_labels="anaysis_error_modal_labels"
        @handle_confirmation="close_analysis_complete_modal('data-analysis-error')"
      />
    </b-modal>
    <b-modal
      id="analysis-closure-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget @handle_confirmation="handle_confirmation" />
    </b-modal>
  </div>
</template>
<script>
import { ENUMS } from "@/store/modules/playback/enums";
import DataAnalysisWidget from "@/components/playback/controls/data_analysis/DataAnalysisWidget.vue";
import DataAnalysisCompleteWidget from "@/components/playback/controls/data_analysis/DataAnalysisCompleteWidget.vue";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";

import BootstrapVue from "bootstrap-vue";
import { BModal, VBPopover } from "bootstrap-vue";
import Vue from "vue";
import { mapState } from "vuex";

Vue.use(BootstrapVue);
Vue.component("BModal", BModal);
Vue.directive("b-popover", VBPopover);

export default {
  name: "DataAnalysisControl",
  components: {
    DataAnalysisWidget,
    StatusWarningWidget,
    DataAnalysisCompleteWidget,
  },
  data: function () {
    return {
      warning_modal_labels: {
        header: "No Recordings Found!",
        msg_one: `There were no recordings found. Please ensure that they are located in the correct directory: `,
        msg_two: "C:\\recording\\path\\placeholder",
        button_names: ["Close"],
      },
      anaysis_error_modal_labels: {
        header: "Error!",
        msg_one: `An error occurred during the analysis.`,
        msg_two: "Please try again later.",
        button_names: ["Close"],
      },
    };
  },
  computed: {
    ...mapState("settings", [
      "recordings_list",
      "root_recording_path",
      "data_analysis_directory",
      "confirmation_request",
    ]),
    ...mapState("playback", ["data_analysis_state", "playback_state"]),
    ...mapState("stimulation", ["stim_status"]),
    analysis_tooltip_text: function () {
      return "Run analysis on existing recordings.";
    },
    dynamic_button_class: function () {
      return "button__data-analysis-button";
    },
  },
  watch: {
    root_recording_path: function (new_path, _) {
      this.warning_modal_labels.msg_two = new_path;
    },
    data_analysis_state: function (new_state, _) {
      if (new_state == ENUMS.DATA_ANALYSIS_STATE.COMPLETE) {
        this.$bvModal.hide("start-data-analysis");
        this.$bvModal.show("data-analysis-complete");
      } else if (new_state == ENUMS.DATA_ANALYSIS_STATE.ERROR) {
        this.$bvModal.hide("start-data-analysis");
        this.$bvModal.show("data-analysis-error");
      }
    },
    confirmation_request: function (new_val, _) {
      if (new_val && this.data_analysis_state === ENUMS.DATA_ANALYSIS_STATE.ACTIVE) {
        this.$bvModal.show("analysis-closure-warning");
      }
    },
  },
  methods: {
    check_analysis_requirements: async function () {
      await this.$store.dispatch("settings/get_recording_dirs");

      if (this.recordings_list.length > 0) this.$bvModal.show("start-data-analysis");
      else this.$bvModal.show("no-recordings-warning");
    },
    close_analysis_modal: async function ({ idx, selected_recordings }) {
      if (idx === 2) await this.$store.dispatch("playback/start_data_analysis", selected_recordings);
      else if (idx === 0) this.$bvModal.hide("start-data-analysis");
    },
    close_analysis_complete_modal: function (id) {
      this.$bvModal.hide(id);
      this.$store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE.READY);
      this.$store.commit("settings/set_failed_recordings", []);
      this.$store.commit("playback/set_selected_recordings", []);
    },
    handle_confirmation: function (idx) {
      this.$bvModal.hide("analysis-closure-warning");
      this.$emit("send_confirmation", idx);
    },
  },
};
</script>
<style>
.button__data-analysis-button {
  background: #b7b7b7;
  border: 1px solid #b7b7b7;
  left: 28px;
  width: 230px;
  position: relative;
  margin-top: 15px;
  font-size: 15px;
}
.button__data-analysis-button:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}

#start-data-analysis,
#data-analysis-complete {
  position: fixed;
  margin: 5% auto;
  top: 10%;
  left: -10%;
  right: 0;
}

#analysis-closure-warning,
#no-recordings-warning,
#data-analysis-error {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
