<template>
  <div>
    <YAxisControls :height="'100px'"></YAxisControls>
  </div>
</template>

<script>
import { YAxisControls } from "../../../../dist/mantarray.common";

export default {
  components: {
    YAxisControls,
  },
  created: function () {
    const y_zoom_levels = [
      { y_min: 0, y_max: 500 },
      { y_min: 100, y_max: 400 },
      { y_min: 200, y_max: 300 },
    ];
    const default_zoom_level_idx = 1;

    this.$store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
    this.$store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
  },
};
</script>
