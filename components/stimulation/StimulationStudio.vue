<template>
  <div>
    <StimulationStudioWidget />
    <StimulationStudioCreateAndEdit />
  </div>
</template>

<script>
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

export default {
  name: "StimulationStudio",
  components: {
    StimulationStudioWidget,
    StimulationStudioCreateAndEdit,
  },
};
</script>

<style></style>
