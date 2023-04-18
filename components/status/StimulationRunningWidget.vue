<template>
  <div>
    <div v-if="is_visible" :class="{ flash: is_flashing }">Stimulation is Running</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StimulationRunningWidget",

  computed: {
    ...mapState("stimulation", ["stim_play_state"]),
    is_flashing() {
      return this.stim_play_state;
    },
    is_visible() {
      return this.stim_play_state;
    },
  },
};
</script>

<style>
.flash {
  animation: flash 1s infinite;
  color: white;
  background-color: red;
  padding: 3px;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
