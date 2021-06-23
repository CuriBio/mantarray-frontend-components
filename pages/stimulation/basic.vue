<template>
  <div class="div__stimulationstudio-layout-background">
    <div class="div__stimulationstudio-header-container" />
    <div class="div__stimulationstudio-left-column-container" />
    <span class="span__stimulationstudio-header-label">Stimulation Studio </span>
    <StimulationStudioWidget />
    <StimulationStudioCreateAndEdit />
    <StimulationStudioDragAndDropPanel />
    <StimulationStudioBlockViewEditor />
    <div class="button-background">
      <div v-for="(key, value, idx) in btn_labels" :id="value" :key="value" @click.exact="handle_click(idx)">
        <div :class="'btn-container'" :style="key">
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

export default {
  name: "StimulationStudio",
  components: {
    StimulationStudioWidget,
    StimulationStudioCreateAndEdit,
    StimulationStudioDragAndDropPanel,
    StimulationStudioBlockViewEditor,
  },
  data() {
    return {
      btn_labels: {
        "Save Changes": "",
        "Clear/Reset All": "",
        "Discard Changes": "",
      },
    };
  },
  methods: {
    handle_click(idx) {
      console.log("clicked");
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
  pointer-events: all;
}
</style>
