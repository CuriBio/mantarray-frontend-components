<template>
  <div>
    <YAxisControls />
    <button id="min_button" class="update-button" @click="update_y_zoom_min">Update min</button>
    <button id="max_button" class="update-button" :style="'top: 200px;'" @click="update_y_zoom_max">
      Update max
    </button>
  </div>
</template>

<script>
import { YAxisControls } from "@/dist/mantarray.common";
// import YAxisControls from "@/components/playback/controls/YAxisControls.vue";

export default {
  components: {
    YAxisControls,
  },
  methods: {
    update_y_zoom_min() {
      const new_range = { min: 2, max: 4, midpoint: 3 };
      this.$store.commit("waveform/set_y_axis", new_range);
    },
    update_y_zoom_max() {
      const new_range = { min: -201, max: 100001, midpoint: 49900 };
      this.$store.commit("waveform/set_y_axis", new_range);
    },
  },
};
</script>
<style scoped>
.update-button {
  position: absolute;
  top: 100px;
  left: 3000px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
</style>
