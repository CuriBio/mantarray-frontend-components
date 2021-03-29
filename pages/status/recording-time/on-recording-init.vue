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
  created: function () {
    this.$store.dispatch("playback/start_recording");
  },
};
</script>
