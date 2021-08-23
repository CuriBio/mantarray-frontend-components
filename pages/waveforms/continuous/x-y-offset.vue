<template>
  <div style="top: 21px; left: 34px; position: absolute">
    <ContinuousWaveform
      :display_waveform_idx="1"
      :x_axis_sample_length="100000"
      :y_label="'My Y'"
      :x_label="'Their X'"
      :line_color="'#FFFF00'"
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
    const x_values = [0, 3000, 7000, 14000, 23000];
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
      { x_scale: 30 * 100000 },
      { x_scale: 15 * 100000 },
      { x_scale: 5 * 100000 },
      { x_scale: 2 * 100000 },
      { x_scale: 1 * 100000 },
    ];
    const default_x_zoom_level_idx = 2;
    this.$store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    this.$store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
  },
};
</script>
