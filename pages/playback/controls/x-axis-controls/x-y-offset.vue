<template>
  <div>
    <XAxisControls :css_top_anchor="'33px'" :css_left_anchor="'19px'"></XAxisControls>
  </div>
</template>

<script>
import XAxisControls from "@/components/playback/controls/XAxisControls.vue";

export default {
  components: {
    XAxisControls,
  },
  created: function () {
    const x_zoom_levels = [{ x_scale: 30 * 1e6 }, { x_scale: 15 * 1e6 }, { x_scale: 5 * 1e6 }];
    const default_zoom_level_idx = 1;

    this.$store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    this.$store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
  },
};
</script>
