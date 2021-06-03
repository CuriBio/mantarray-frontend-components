<template>
  <div class="div__simulationstudio-backdrop">
    <span class="span__stimulationstudio-layout-create_edit-header-label"
      >Create/Edit Stimulation Protocol</span
    >
    <span class="span__stimulationstudio-layout-subheader-label">Select/Create Protocol</span>
    <div class="div__stimulationstudio-select-dropdown-container">
      <SelectDropDown :options_text="['Create New']" :input_width="550" />
    </div>
    <div class="div__stimulationstudio-btn-container">
      <canvas class="canvas__heatmap-settings-reset-btn-container"></canvas>
      <span class="span__stimulationstudio-btn-label"> Apply </span>
    </div>
  </div>
</template>

<script>
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
export default {
  name: "StimulationStudioCreateAndEdit",
  components: {
    SelectDropDown,
  },
};
</script>

<style>
.div__simulationstudio-backdrop {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 630px;
  height: 280px;
  visibility: visible;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
}
.span__stimulationstudio-layout-create_edit-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  padding-top: 15px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.span__stimulationstudio-layout-subheader-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  top: 45px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
}
.div__stimulationstudio-select-dropdown-container {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 210px;
  height: 50px;
  top: 80px;
  right: 380px;
  padding: 5px;
  visibility: visible;
}
.div__stimulationstudio-select-dropdown-container > .div__input-dropdown-background {
  background: none;
  border: none;
}
.canvas__stimulationstudio-btn-container {
  transform: translateZ(0);
  position: absolute;
  width: 130px;
  height: 55px;
  /* top: 0px;
  left: 0px; */
  background: #b7b7b7;
}
.div__stimulationstudio-btn-container {
  pointer-events: all;
  /* transform: rotate(0deg); */
  /* overflow: hidden; */
  /* position: absolute; */
  width: 130px;
  height: 55px;
  /* top: 806px;
  left: 1490.08px; */
  visibility: visible;
  /* z-index: 154; */
}
.span__stimulationstudio-btn-label {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 120px;
  height: 45px;
  line-height: 47px;
  top: 5px;
  left: 5px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(0, 0, 0);
}
</style>
