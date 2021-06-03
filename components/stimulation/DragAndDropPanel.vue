<template>
  <div class="div__heatmap-layout-heatmap-settings-panel">
    <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
    <canvas class="canvas__stimulationstudio-header-seperator" width="272" height="2"> </canvas>
  </div>
</template>
<script>
export default {
  name: "DragAndDropPanel",
};
</script>
<style scoped>
.div__heatmap-layout-heatmap-settings-panel {
  transform: rotate(0deg);
  box-sizing: border-box;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 18%;
  height: 94%;
  bottom: 0;
  left: 82%;
  visibility: visible;
  box-shadow: none;
  pointer-events: all;
  border: 2px solid rgb(17, 17, 17);
  display: flex;
  justify-content: center;
}
.span__stimulationstudio-drag-drop-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  padding-top: 25px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.canvas__stimulationstudio-header-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 272px;
  height: 2px;
  top: 65px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}
</style>
