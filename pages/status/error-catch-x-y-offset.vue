<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest
      log_filepath="C:\Users\Eli\CuriBio\AppData\Roaming\MantarrayController\logs_flask\mantarrally_log__2020_10_21_185640.txt"
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
