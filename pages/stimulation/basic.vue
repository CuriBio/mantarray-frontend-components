<template>
  <div class="div__stimulationstudio-layout-background">
    <div class="div__stimulationstudio-header-container">
      <div class="upload-files-widget-container">
        <UploadFilesWidget />
      </div>
      <div class="recording-time-container">
        <RecordingTime />
      </div>
    </div>
    <div class="div__stimulationstudio-left-column-container">
      <StimulationControls />
    </div>
    <span class="span__stimulationstudio-header-label">Stimulation Studio </span>
    <StimulationStudioWidget />
    <StimulationStudioCreateAndEdit />
    <StimulationStudioDragAndDropPanel :stimulation_type="stimulation_type" :time_unit="time_unit" />
    <StimulationStudioBlockViewEditor @handle_current_assignment="handle_current_assignment" />
    <StimulationStudioProtocolViewer :stimulation_type="stimulation_type" :time_unit="time_unit" />
    <div class="button-background">
      <div v-for="(value, idx) in btn_labels" :id="value" :key="value" @click.exact="handle_click(idx)">
        <div :class="'btn-container'">
          <span :class="'btn-label'">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import StimulationStudioBlockViewEditor from "@/components/stimulation/StimulationStudioBlockViewEditor.vue";
import StimulationStudioProtocolViewer from "@/components/stimulation/StimulationStudioProtocolViewer.vue";
import RecordingTime from "@/components/status/RecordingTime.vue";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";

export default {
  name: "StimulationStudio",
  components: {
    StimulationStudioWidget,
    StimulationStudioCreateAndEdit,
    StimulationStudioDragAndDropPanel,
    StimulationStudioBlockViewEditor,
    StimulationStudioProtocolViewer,
    UploadFilesWidget,
    RecordingTime,
    StimulationControls,
  },
  data() {
    return {
      btn_labels: ["Save Changes", "Clear/Reset All", "Discard Changes"],
      stimulation_type: "Voltage (V)",
      time_unit: "Time (s)",
      current_assignment: {},
    };
  },
  created: async function () {
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/handle_stimulation_type") {
        this.stimulation_type = this.$store.getters["stimulation/get_stimulation_type"];
      }
      if (mutation.type === "stimulation/handle_time_unit") {
        this.time_unit = this.$store.getters["stimulation/get_time_unit"];
      }
      if (mutation.type === "stimulation/reset_state") {
        this.time_unit = "Time (s)";
        this.stimulation_type = "Voltage (V)";
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    handle_click(idx) {
      const { color, letter } = this.current_assignment;
      const { name } = this.$store.state.stimulation.new_protocol;
      if (idx === 1) this.$store.commit("stimulation/reset_state");
      if (idx === 0) {
        this.$store.commit("stimulation/set_imported_protocol", { color, letter, label: name });
        this.$store.commit("stimulation/reset_new_protocol");
      }
    },
    handle_current_assignment(assignment) {
      this.current_assignment = assignment;
    },
  },
};
</script>

<style scoped>
.div__stimulationstudio-layout-background {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 1800px;
  height: 1000px;
  left: 1px;
  border: 0px none rgb(0, 0, 0);
}

.span__stimulationstudio-header-label {
  pointer-events: all;
  line-height: 100%;
  left: 22%;
  top: 5%;
  transform: rotate(0deg);
  position: absolute;
  padding-top: 25px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 23px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.btn-container:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}
.button-background {
  width: 60%;
  display: flex;
  justify-content: center;
  left: 20%;
  top: 93%;
  height: 60px;
  position: absolute;
}
.btn-container {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  width: 90%;
  height: 50px;
  margin: 0 40px 0 40px;
  background: #b7b7b7;
}
.btn-label {
  transform: translateZ(0px);
  line-height: 50px;
  font-family: Muli;
  font-size: 16px;
  color: rgb(0, 0, 0);
}
.div__stimulationstudio-left-column-container {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  bottom: 0;
  width: 18%;
  height: 94%;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}
.div__stimulationstudio-header-container {
  transform: rotate(0deg);
  background: rgb(17, 17, 17);
  position: absolute;
  width: 82%;
  left: 18%;
  height: 6%;
  border-bottom: 2px solid black;
  display: flex;
  justify-content: center;
}
.upload-files-widget-container {
  position: relative;
  top: 15%;
  left: 5%;
}
.recording-time-container {
  position: relative;
  left: 34%;
  top: 15%;
}
</style>
