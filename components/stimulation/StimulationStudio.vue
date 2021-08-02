<template>
  <div class="div__stimulationstudio-layout-background">
    <span class="span__stimulationstudio-header-label">Stimulation Studio </span>
    <StimulationStudioWidget class="stimulationstudio_widget-container" />
    <StimulationStudioCreateAndEdit
      class="stimulationstudio_createandedit-container"
      @handle_selection_change="handle_selection_change"
    />
    <StimulationStudioDragAndDropPanel
      class="stimulationstudio_draganddroppanel-container"
      :stimulation_type="stimulation_type"
      :time_unit="time_unit"
    />
    <StimulationStudioBlockViewEditor class="stimulationstudio_blockvieweditor-container" />
    <StimulationStudioProtocolViewer
      class="stimulationstudio_protocolviewer-container"
      :stimulation_type="stimulation_type"
    />
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

export default {
  name: "StimulationStudio",
  components: {
    StimulationStudioWidget,
    StimulationStudioCreateAndEdit,
    StimulationStudioDragAndDropPanel,
    StimulationStudioBlockViewEditor,
    StimulationStudioProtocolViewer,
  },
  data() {
    return {
      btn_labels: ["Save Changes", "Clear/Reset All", "Discard Changes"],
      stimulation_type: "Voltage (mV)",
      time_unit: "Time (s)",
      current_assignment: {},
      selected_protocol: { label: "Create New", color: "", letter: "" },
    };
  },
  created: async function () {
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/set_stimulation_type") {
        this.stimulation_type = this.$store.getters["stimulation/get_stimulation_type"];
      }
      if (mutation.type === "stimulation/set_time_unit") {
        this.time_unit = this.$store.getters["stimulation/get_time_unit"];
      }
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.time_unit = "Time (s)";
        this.stimulation_type = "Voltage (mV)";
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    async handle_click(idx) {
      if (idx === 0) {
        await this.$store.dispatch("stimulation/add_saved_protocol");
        this.$store.dispatch("stimulation/handle_protocol_editor_reset");
        this.selected_protocol = { label: "Create New", color: "", letter: "" };
      }

      if (idx === 1) this.$store.commit("stimulation/reset_state");

      if (idx === 2 && this.selected_protocol.label !== "Create New") {
        this.$store.dispatch("stimulation/edit_selected_protocol", this.selected_protocol);
      } else if (idx === 2 && this.selected_protocol.label === "Create New")
        this.$store.commit("stimulation/reset_protocol_editor");
    },

    handle_selection_change(protocol) {
      this.selected_protocol = protocol;
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
  width: 1629px;
  height: 885px;
  left: 1px;
  display: grid;
  grid-template-columns: 555px 705px 365px;
  grid-template-rows: 60px 290px 220px 297px;
}

.span__stimulationstudio-header-label {
  pointer-events: all;
  grid-area: 1 / 1 / 2 / 2;
  align-self: center;
  line-height: 100%;
  transform: rotate(0deg);
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
  left: 10%;
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
.stimulationstudio_widget-container {
  grid-area: 2 / 1 / 3 / 2;
  right: 20px;
}
.stimulationstudio_createandedit-container {
  grid-area: 2 / 2 / 3 / 3;
}

.stimulationstudio_draganddroppanel-container {
  grid-area: 1 / 3 / 4 / 3;
}
.stimulationstudio_blockvieweditor-container {
  grid-area: 3 / 1 / 4 / 3;
}
.stimulationstudio_protocolviewer-container {
  grid-area: 4 / 1 / 5 / 3;
  left: 35px;
}
</style>
