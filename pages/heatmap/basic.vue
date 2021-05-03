<template>
  <div>
    <HeatMap></HeatMap>
  </div>
</template>

<script>
import { HeatMap } from "@/dist/mantarray.common";
// import HeatMap from "@/components/heatmap/HeatMap.vue";

export default {
  components: {
    HeatMap,
  },
  created: function () {
    const radio_button_list = ["Warm", "Cool", "Blue/Red", "Purple/Green"];
    const display_options = [
      "Twitch Force",
      "Twitch Period",
      "Twitch Frequency",
      "Twitch Width 80",
      "Contraction Velocity",
      "Relaxation Velocity",
    ];
    const display_min_max = [
      {
        min: 0,
        max: 50,
      },
      {
        min: 0,
        max: 100,
      },
      {
        min: 0,
        max: 200,
      },
      {
        min: 0,
        max: 400,
      },
      {
        min: 0,
        max: 800,
      },
      {
        min: 0,
        max: 1600,
      },
    ];
    this.$store.commit("heatmap/set_heatmap_options_array", radio_button_list);
    this.$store.commit("heatmap/set_heatmap_display_array", display_options);
    this.$store.commit("heatmap/set_heatmap_display_min_max", display_min_max);
  },
};
</script>
