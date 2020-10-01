<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { PlateNavigator as ComponentToTest } from "../../../../dist/mantarray.common";
// import ComponentToTest from "@/components/playback/controls/PlateNavigator.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
