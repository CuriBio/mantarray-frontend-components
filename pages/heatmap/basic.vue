<template>
  <div>
    <div>
      <HeatMap></HeatMap>
    </div>
    <div>
      <button class="start-button" @click="start_well_data">Start Data</button>
      <button class="stop-button" @click="stop_well_data">Stop Data</button>
    </div>
  </div>
</template>

<script>
// import { HeatMap } from "@/dist/mantarray.common";
import HeatMap from "@/components/heatmap/HeatMap.vue";

export default {
  components: {
    HeatMap,
  },
  created: function () {
    const data = [
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    ];

    const heatmap_values = {
      "Twitch Force": { data: data[0] },
      "Twitch Period": { data: data[1] },
      "Twitch Frequency": { data: data[2] },
      "Twitch Width 80": { data: data[3] },
      "Contraction Velocity": { data: data[4] },
      "Relaxation Velocity": { data: data[5] },
    };
    this.$store.commit("data/set_heatmap_values", heatmap_values);
  },

  methods: {
    start_well_data() {
      this.interval = setInterval(this.deltaT, 100);
    },
    deltaT() {
      let values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      this.$store.commit("data/set_metric_data", {
        name: "Twitch Force",
        data: values,
      });

      values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 200));
      this.$store.commit("data/set_metric_data", {
        name: "Twitch Period",
        data: values,
      });

      values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50));
      this.$store.commit("data/set_metric_data", {
        name: "Twitch Frequency",
        data: values,
      });

      values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      this.$store.commit("data/set_metric_data", {
        name: "Twitch Width 80",
        data: values,
      });

      values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      this.$store.commit("data/set_metric_data", {
        name: "Contraction Velocity",
        data: values,
      });

      values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
      this.$store.commit("data/set_metric_data", {
        name: "Relaxation Velocity",
        data: values,
      });
    },
    stop_well_data() {
      clearInterval(this.interval);
    },
  },
};
</script>
<style>
.start-button {
  position: absolute;
  top: 100px;
  left: 1640px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4caf50;
  z-index: 999;
}
.stop-button {
  position: absolute;
  top: 200px;
  left: 1640px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #008cba;
  z-index: 999;
}
</style>
