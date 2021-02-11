<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { RecordingTime as ComponentToTest } from "@/dist/mantarray.common";
//  import ComponentToTest from "@/components/playback/controls/RecordingTime.vue";
export default {
  components: {
    ComponentToTest,
  },
};
</script>
