<template>
  <div>
    <ComponentToTest
      log_filepath="C:\Users\Mantarray\AppData\Roaming\MantarrayController\logs_flask"
      shutdown_error_message="Error during install. Please reinstall the Mantarray software after restarting this computer"
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
