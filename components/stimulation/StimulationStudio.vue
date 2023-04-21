<template>
  <div class="div__stimulationstudio-layout-background">
    <span class="span__stimulationstudio-header-label">Stimulation Studio</span>
    <StimulationStudioWidget class="stimulationstudio_widget-container" />
    <StimulationStudioCreateAndEdit
      class="stimulationstudio_createandedit-container"
      :disable_edits="disable_edits"
      @handle_selection_change="handle_selection_change"
    />
    <StimulationStudioDragAndDropPanel
      class="stimulationstudio_draganddroppanel-container"
      :disable_edits="disable_edits"
    />
    <StimulationStudioBlockViewEditor
      class="stimulationstudio_blockvieweditor-container"
      @new-rest-dur="new_rest_dur"
    />
    <StimulationStudioProtocolViewer class="stimulationstudio_protocolviewer-container" />
    <div class="button-background">
      <div v-for="(value, idx) in btn_labels" :id="value" :key="value" @click.exact="handle_click(idx)">
        <div v-b-popover.hover.top="btn_hover" :class="get_btn_class(idx)">
          <span :class="get_btn_label_class(idx)">{{ value }}</span>
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
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";

/**
 * @vue-data {Array} btn_labels - button labels for base of stim studio component
 * @vue-data {Object} selected_protocol - Current selected protocol from drop down in CreateAndEdit component
 * @vue-event {Event} handle_click - Handles what gets executed when any of the base buttons are selected
 * @vue-event {Event} handle_selection_changed - Gets emitted when a user selected a protocol for edit so it can be used if new changes need to be discarded
 */

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
      selected_protocol: { label: "Create New", color: "", letter: "" },
      rest_dur_is_valid: true,
    };
  },
  computed: {
    ...mapState("playback", ["playback_state"]),
    ...mapState("stimulation", ["stim_status"]),
    disable_edits: function () {
      return (
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.RECORDING ||
        this.stim_status === STIM_STATUS.STIM_ACTIVE
      );
    },
    btn_hover: function () {
      return {
        content: "Cannot make changes to stim settings while actively stimulating or recording",
        disabled: !this.disable_edits,
      };
    },
  },
  methods: {
    async handle_click(idx) {
      if (this.disable_edits) {
        return;
      }

      if (idx === 0) {
        await this.$store.dispatch("stimulation/add_saved_protocol");
        this.$store.dispatch("stimulation/handle_protocol_editor_reset");
        this.selected_protocol = { label: "Create New", color: "", letter: "" };
      } else if (idx === 1) {
        this.$store.commit("stimulation/reset_state");
      } else if (idx === 2) {
        if (this.selected_protocol.label === "Create New") {
          this.$store.commit("stimulation/reset_protocol_editor");
        } else {
          this.$store.dispatch("stimulation/edit_selected_protocol", this.selected_protocol);
        }
      }
    },
    new_rest_dur(is_valid) {
      this.rest_dur_is_valid = is_valid;
    },

    handle_selection_change(protocol) {
      this.selected_protocol = protocol;
    },
    get_btn_class(idx) {
      return this.disable_edits || (idx === 0 && !this.rest_dur_is_valid)
        ? "btn-container-disable"
        : "btn-container";
    },
    get_btn_label_class(idx) {
      return this.disable_edits || (idx === 0 && !this.rest_dur_is_valid) ? "btn-label-disable" : "btn-label";
    },
  },
};
</script>

<style scoped>
body {
  user-select: none;
}

.div__stimulationstudio-layout-background {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 1629px;
  height: 885px;
}

.span__stimulationstudio-header-label {
  pointer-events: all;
  align-self: center;
  line-height: 100%;
  position: relative;
  transform: rotate(0deg);
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 23px;
  width: 658px;
  height: 24px;
  top: 20px;
  left: 200px;
  color: rgb(255, 255, 255);
  text-align: center;
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

.btn-container-disable {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  width: 90%;
  height: 45px;
  margin: 0 40px 0 40px;
  background: #b7b7b7c9;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  width: 90%;
  height: 45px;
  margin: 0 40px 0 40px;
  background: #b7b7b7;
}

.btn-container:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}

.btn-label {
  transform: translateZ(0px);
  line-height: 45px;
  font-family: Muli;
  font-size: 16px;
  color: rgb(0, 0, 0);
}

.btn-label-disable {
  transform: translateZ(0px);
  line-height: 45px;
  font-family: Muli;
  font-size: 16px;
  color: #6e6f72;
}

.stimulationstudio_widget-container {
  top: 77px;
  left: 132px;
}

.stimulationstudio_createandedit-container {
  top: 77px;
  left: 563px;
}

.stimulationstudio_draganddroppanel-container {
  top: 0px;
}

.stimulationstudio_blockvieweditor-container {
  top: 375px;
  left: 6px;
}

.stimulationstudio_protocolviewer-container {
  top: 570px;
  left: 6px;
}
</style>
