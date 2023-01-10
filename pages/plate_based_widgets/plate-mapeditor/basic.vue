<template>
  <div>
    <ComponentToTest />
  </div>
</template>

<script>
// import { PlateMapEditor as ComponentToTest } from "@/dist/mantarray.common";
import ComponentToTest from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
