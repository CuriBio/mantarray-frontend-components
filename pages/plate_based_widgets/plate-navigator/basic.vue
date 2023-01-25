<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
// import { PlateNavigator as ComponentToTest } from "@/dist/mantarray.common";
import ComponentToTest from "@/components/plate_based_widgets/navigator/PlateNavigator.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
