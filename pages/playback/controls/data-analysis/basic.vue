<template>
  <div>
    <DataAnalysisWidget />
    <button class="update-button" @click="update_directories">Update directories</button>
  </div>
</template>

<script>
// import { DataAnalysisWidget } from "../../../../dist/mantarray.common";
import DataAnalysisWidget from "@/components/playback/controls/data_analysis/DataAnalysisWidget.vue";

export default {
  components: {
    DataAnalysisWidget,
  },
  methods: {
    update_directories() {
      this.$store.dispatch("settings/get_recording_dirs");
    },
  },
};
</script>
<style>
.update-button {
  position: absolute;
  top: 100px;
  left: 750px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
.controls-container {
  left: 5%;
  top: 75%;
  position: absolute;
}
</style>
