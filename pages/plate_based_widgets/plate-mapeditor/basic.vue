<template>
  <div>
    <ComponentToTest />
    <PlateNavigator />
  </div>
</template>

<script>
// import { PlateMapEditor as ComponentToTest } from "@/dist/mantarray.common";
import ComponentToTest from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
import PlateNavigator from "@/components/plate_based_widgets/navigator/PlateNavigator.vue";

export default {
  components: {
    ComponentToTest,
    PlateNavigator,
  },
};
</script>
