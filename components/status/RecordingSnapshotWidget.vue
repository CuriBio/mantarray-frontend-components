<template>
  <div class="div__recording-check-background">
    <div class="div__recording-check-header">Recording Snapshot</div>
    <div class="div__recording-check-message">
      Here is a quick look at this recording. If the snapshot looks abnormal compared to expected contraction
      waveforms, please recalibrate and record the data again.
    </div>
    <div v-if="recording_snapshot_data.length === 24" class="div__scrollable-container">
      <div class="div__waveform-grid">
        <div
          v-for="well_idx in Array(24).keys()"
          :key="well_idx"
          :style="`grid-area: ${well_names[well_idx]}`"
        >
          <Waveform
            :tissue_data_points="recording_snapshot_data[well_idx]"
            :samples_per_second="100"
            :x_axis_sample_length="500"
            :x_axis_min="0"
            :title_left="40"
            :plot_area_pixel_height="150"
            :plot_area_pixel_width="200"
            :title="well_names[well_idx]"
            :show_labels="false"
            :ticks="5"
            :x_axis_factor="1"
            :y_max="y_max_min_values[well_idx].max"
            :y_min="y_max_min_values[well_idx].min"
          />
        </div>
      </div>
    </div>
    <canvas class="canvas__vertical-line" />
    <canvas class="canvas__common-horizontal-line" />
    <span class="span__x-axis-label">Time (seconds)</span>
    <span class="span__y-axis-label">Absolute Force (μN)</span>
    <ButtonWidget
      :button_names="['Close']"
      :button_widget_width="1900"
      :button_widget_height="60"
      :button_widget_top="840"
      :hover_color="['#bd4932', '#19ac8a']"
      @btn-click="close_modal"
    />
  </div>
</template>
<script>
import Waveform from "@/components/playback/waveform/Waveform.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { mapState } from "vuex";
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);

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
    well_names: function () {
      return Array(24)
        .fill()
        .map((_, idx) => twenty_four_well_plate_definition.get_well_name_from_well_index(idx, true));
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
  top: -5px;
  height: 850px;
  left: -385px;
  width: 1900px;
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
  grid-template-areas:
    "A01 A02 A03 A04 A05 A06"
    "B01 B02 B03 B04 B05 B06"
    "C01 C02 C03 C04 C05 C06"
    "D01 D02 D03 D04 D05 D06";
}
.div__scrollable-container {
  position: relative;
  width: 1800px;
  height: 680px;
  overflow-y: scroll;
  background: black;
  left: 20px;
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
.canvas__vertical-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 281px;
  top: 541px;
  left: 36px;
  background-color: rgb(255, 255, 255);
}

.span__x-axis-label {
  font-family: Muli;
  font-size: 16px;
  position: absolute;
  color: rgb(255, 255, 255);
  top: 809px;
  overflow: hidden;
}

.span__y-axis-label {
  transform: rotate(-90deg);
  font-family: Muli;
  font-size: 16px;
  position: absolute;
  color: rgb(255, 255, 255);
  top: 440px;
  left: -37px;
  overflow: hidden;
}

.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: relative;
  height: 2px;
  top: 0px;
  left: -500px;
  width: 825px;
  margin: 20px;
  background-color: rgb(255, 255, 255);
}
</style>
