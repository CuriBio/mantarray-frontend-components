<template>
  <div>
    <p>Click the button to toggle stimulation</p>
    <button @click="toggleStimulation">
      {{ stimulationRunning ? "Stop stimulation" : "Start stimulation" }}
    </button>
    <StimulationRunningWidget :stimulation-running="stimulationRunning" />
  </div>
</template>

<script>
import StimulationRunningWidget from "@/components/status/StimulationRunningWidget";

export default {
  components: {
    StimulationRunningWidget,
  },
  data() {
    return {
      stimulationRunning: false,
    };
  },
  methods: {
    toggleStimulation() {
      this.stimulationRunning = !this.stimulationRunning;
    },
  },
};
</script>
