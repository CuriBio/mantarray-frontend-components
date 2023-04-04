<template>
  <div>
    <div
      :style="{ border: borderStyle, backgroundColor: backgroundValue, color: textColor }"
      class="div__stimulation_status"
    >
      {{ textValue }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StimulationRunningWidget",
  data() {
    return {
      borderStyle: "2px solid red",
    };
  },
  computed: {
    ...mapState("stimulation", ["stim_play_state"]),
    textValue() {
      return this.stim_play_state ? "Stimulation is Running" : "Stimulation is Stopped";
    },
    backgroundValue() {
      return this.stim_play_state ? "red" : "white";
    },
    textColor() {
      return this.stim_play_state ? "white" : "black";
    },
  },
  created() {
    this.flashInterval = setInterval(() => {
      if (this.stim_play_state) {
        this.borderStyle = "2px solid red";
        setTimeout(() => {
          this.borderStyle = "2px solid black";
        }, 1000);
      }
    }, 600);
  },
  beforeDestroy() {
    clearInterval(this.flashInterval);
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
