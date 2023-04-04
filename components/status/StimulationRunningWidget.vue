<template>
  <div>
    <div
      :style="{ border: border_style, backgroundColor: background_value, color: text_color }"
      class="div__stimulation_status"
    >
      {{ text_value }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StimulationRunningWidget",
  data() {
    return {
      border_style: "2px solid red",
      background_value: "red",
    };
  },
  computed: {
    ...mapState("stimulation", ["stim_play_state"]),
    text_value() {
      return this.stim_play_state ? "Stimulation is Running" : "Stimulation is Stopped";
    },
    text_color() {
      return this.stim_play_state ? "white" : "black";
    },
  },
  created() {
    this.flash_interval = setInterval(() => {
      if (this.stim_play_state) {
        this.border_style = "2px solid red";
        this.background_value = "red";
        setTimeout(() => {
          this.border_style = "2px solid black";
          this.background_value = "white";
        }, 1000);
      }
    }, 600);
  },
  beforeDestroy() {
    clearInterval(this.flash_interval);
  },
};
</script>
<style>
.div__stimulation_status {
  width: 175px;
  margin: 0;
  text-align: center;
  font-family: Muli;
  background-color: red;
}
</style>
