<template>
  <div style="top: 155px; left: 44px; position: absolute">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { PlateNavigator as ComponentToTest } from "@/dist/mantarray.common";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
