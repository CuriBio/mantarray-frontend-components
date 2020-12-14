<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest
      log_filepath="C:\\Users\\Mantarray\\AppData\\Roaming\\MantarrayController\\logs_flask"
    ></ComponentToTest>
  </div>
</template>

<script>
import { ErrorCatchWidget as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/status/ErrorCatchWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
