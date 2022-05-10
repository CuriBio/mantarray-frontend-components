<template>
  <div>
    <DataAnalysisCompleteWidget />
    <button class="update-button" @click="update_directories">Update directories</button>
  </div>
</template>

<script>
import DataAnalysisCompleteWidget from "@/components/playback/controls/data_analysis/DataAnalysisCompleteWidget.vue";

export default {
  components: {
    DataAnalysisCompleteWidget,
  },
  methods: {
    update_directories: function () {
      const recordings = {
        data_analysis_path: "C:\\recording\\path\\users\\MantarrayController\\time_force_data",
        recordings_list: ["rec_1", "rec_2", "rec3", "rec_1", "rec_2", "rec3", "rec_1", "rec_2", "rec3"],
      };
      this.$store.commit("settings/set_failed_recordings", recordings.recordings_list);
      this.$store.commit("settings/set_data_analysis_directory", recordings.data_analysis_path);
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
