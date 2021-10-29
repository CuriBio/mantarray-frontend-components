<template>
  <div>
    <YAxisControls />
    <ContinuousWaveform
      :display_waveform_idx="0"
      :x_axis_sample_length="1e6"
      :y_label="'Kelvin'"
      :x_label="'Time (hours)'"
      :style="'left: 100px'"
    />
  </div>
</template>

<script>
// import { YAxisControls } from "@/dist/mantarray.common";
import YAxisControls from "@/components/playback/controls/YAxisControls.vue";
import ContinuousWaveform from "@/components/playback/waveform/ContinuousWaveform.vue";

export default {
  components: {
    YAxisControls,
    ContinuousWaveform,
  },
  created: function () {
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
