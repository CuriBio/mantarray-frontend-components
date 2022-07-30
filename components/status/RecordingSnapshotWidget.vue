<template>
  <div class="div__recording-check-background">
    <div class="div__recording-check-header">Recording Snapshot</div>
    <div class="div__recording-check-message">
      Here is a quick look at the first five seconds of this recording. <br />Calibration data is being used
      for accuracy. If something looks wrong, try recalibrating and try again.
    </div>
    <div v-if="recording_snapshot_data.length === 24" class="div__scrollable-container">
      <div class="div__waveform-grid">
        <div
          v-for="well_idx in Array(24).keys()"
          :key="well_idx"
          :style="`grid-area: ${well_idx / 6} / ${well_idx % 7}`"
        >
          <Waveform
            :tissue_data_points="recording_snapshot_data[well_idx]"
            :samples_per_second="100"
            :x_axis_sample_length="500"
            :x_axis_min="0"
            :plot_area_pixel_height="150"
            :plot_area_pixel_width="200"
            :show_labels="false"
            :ticks="5"
            :x_axis_factor="1"
            :y_max="y_max_min_values[well_idx].max"
            :y_min="y_max_min_values[well_idx].min"
          />
        </div>
      </div>
    </div>
    <ButtonWidget
      :button_names="['Close']"
      :button_widget_width="1850"
      :button_widget_height="60"
      :button_widget_top="800"
      :hover_color="['#bd4932', '#19ac8a']"
      @btn-click="close_modal"
    />
  </div>
</template>
<script>
import Waveform from "@/components/playback/waveform/Waveform.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { mapState } from "vuex";

export default {
  name: "RecordingSnapshotWidget",
  components: {
    Waveform,
    ButtonWidget,
  },
  computed: {
    ...mapState("data", ["recording_snapshot_data"]),
    y_max_min_values: function () {
      return this.recording_snapshot_data.map((coords) => {
        const y_values = coords.map((coord) => coord[1]);
        const max = Math.max(...y_values) + 0.2 * Math.max(...y_values);
        const min = Math.min(...y_values) - 0.2 * Math.max(...y_values);
        return { max, min };
      });
    },
  },
  methods: {
    close_modal: function () {
      this.$emit("close_modal");
      // reset data for next summary
      this.$store.commit("data/set_recording_snapshot_data", []);
    },
  },
};
</script>
<style scoped>
.div__recording-check-background {
  pointer-events: all;
  position: absolute;
  top: 0;
  left: -355px;
  height: 800px;
  width: 1850px;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
  font-family: Muli;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.div__recording-check-header {
  color: #b7b7b7;
  font-size: 30px;
  width: 100%;
  text-align: center;
  margin: 15px;
}
.div__recording-check-message {
  color: #b7b7b7;
  font-size: 18px;
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
}
.div__waveform-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 200);
  grid-template-rows: repeat(4, 80);
  background: black;
}
.div__scrollable-container {
  position: relative;
  width: 1800px;
  height: 820px;
  overflow-y: scroll;
  background: black;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  height: 15px;
  overflow: visible;
}
::-webkit-scrollbar-thumb {
  background-color: #2f2f2f;
  overflow: visible;
}
::-webkit-scrollbar-track {
  background-color: #1c1c1c;
  overflow: visible;
}
</style>
