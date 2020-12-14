<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { UploadFilesWidget as ComponentToTest } from "../../dist/mantarray.common";
// import ComponentToTest from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
