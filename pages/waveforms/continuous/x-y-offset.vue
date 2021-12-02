<template>
  <div style="top: 21px; left: 34px; position: absolute">
    <ContinuousWaveform
      :display_waveform_idx="1"
      :x_axis_sample_length="1e6"
      :y_label="'My Y'"
      :x_label="'Their X'"
    >
    </ContinuousWaveform>
  </div>
</template>

<script>
// import { ContinuousWaveform } from "@/dist/mantarray.common";
import ContinuousWaveform from "@/components/playback/waveform/ContinuousWaveform.vue";

export default {
  components: {
    ContinuousWaveform,
  },
  computed: {},
  created: function () {
    const x_values = [0, 300000, 700000, 1400000, 2300000];
    const y_values = [90.429978, 98.5820692, 27.728242, 52.3291106, 70.8505055];
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
