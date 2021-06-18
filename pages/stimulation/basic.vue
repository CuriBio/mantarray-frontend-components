<template>
  <div class="div__stimulationstudio-layout-background">
    <div class="div__stimulationstudio-header-container" />
    <div class="div__stimulationstudio-left-column-container" />
    <span class="span__stimulationstudio-header-label">Stimulation Studio </span>
    <StimulationStudioWidget />
    <StimulationStudioCreateAndEdit />
    <StimulationStudioDragAndDropPanel />
    <StimulationStudioProtocolBlockViewEditor />
  </div>
</template>

<script>
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import StimulationStudioProtocolBlockViewEditor from "@/components/stimulation/StimulationStudioProtocolBlockViewEditor.vue";

export default {
  name: "StimulationStudio",
  components: {
    StimulationStudioWidget,
    StimulationStudioCreateAndEdit,
    StimulationStudioDragAndDropPanel,
    StimulationStudioProtocolBlockViewEditor,
  },
};
</script>

<style>
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
