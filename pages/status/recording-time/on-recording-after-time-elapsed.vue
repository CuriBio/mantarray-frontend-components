<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
// import ComponentToTest from "@/components/playback/controls/RecordingTime.vue";
import { RecordingTime as ComponentToTest } from "@/dist/mantarray.common";

export default {
  components: {
    ComponentToTest,
  },
  computed: {},
  created: async function () {
    await this.$store.dispatch("playback/start_recording");
    this.$store.commit("playback/set_x_time_index", 12345000);
  },
};
</script>
