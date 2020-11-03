<template>
  <div>
    <ComponentToTest
      error_file_full_path="C:\Users\Eli\CuriBio\AppData\Roaming\MantarrayController\logs_flask\mantarray_log__2020_10_21_185640.txt"
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
