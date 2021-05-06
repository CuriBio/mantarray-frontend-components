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
    const heatmap_values = [
      10,
      22,
      45,
      67,
      89,
      90,
      33,
      55,
      77,
      67,
      44,
      56,
      78,
      99,
      34,
      19,
      28,
      65,
      24,
      88,
      14,
      27,
      39,
      50,
    ];
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
    const radio_button_gradient = [
      [
        { color: "#bd3532", offset: "0%" },
        { color: "#f9d78c", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00ccbc", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#90eb9d", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    ];
    this.$store.commit("heatmap/set_heatmap_values", heatmap_values);
    this.$store.commit("heatmap/set_heatmap_options_array", radio_button_list);
    this.$store.commit("heatmap/set_heatmap_display_array", display_options);
    this.$store.commit("heatmap/set_heatmap_display_min_max", display_min_max);
    this.$store.commit(
      "heatmap/set_heatmap_options_gradient",
      radio_button_gradient
    );
  },
};
</script>
