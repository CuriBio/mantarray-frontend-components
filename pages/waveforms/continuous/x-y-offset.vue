<template>
  <div class="div__waveform-container">
    <ContinuousWaveform
      :display_waveform_idx="1"
      :x_axis_sample_length="1e6"
      :y_label="'My Y'"
      :x_label="'Their X'"
      :tissue_line_color="'#FFFF00'"
    >
    </ContinuousWaveform>
  </div>
</template>

<script>
import { ContinuousWaveform } from "@/dist/mantarray.common";
export default {
  components: {
    ContinuousWaveform,
  },
  computed: {},
  created: function () {
    const x_values = [0, 30000, 70000, 140000, 230000];
    const y_values = [290.429978, 298.5820692, 327.728242, 352.3291106, 370.8505055];
    this.temp_datapoints = [
      { x_data_points: x_values, y_data_points: y_values },
      { x_data_points: x_values, y_data_points: y_values },
      { x_data_points: x_values, y_data_points: y_values },
      { x_data_points: x_values, y_data_points: y_values },
      { x_data_points: x_values, y_data_points: y_values },
      { x_data_points: x_values, y_data_points: y_values },
    ];
    this.$store.commit("data/set_plate_waveforms", this.temp_datapoints);
    const x_zoom_levels = [
      { x_scale: 30 * 1e6 },
      { x_scale: 15 * 1e6 },
      { x_scale: 5 * 1e6 },
      { x_scale: 2 * 1e6 },
      { x_scale: 1 * 1e6 },
    ];
    const default_x_zoom_level_idx = 2;
    this.$store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    this.$store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
  },
};
</script>
<style scoped>
.div__waveform-container {
  width: 521px;
  height: 419px;
  background: #000000;
  position: absolute;
  top: 21px;
  left: 34px;
}
</style>
