<template>
  <StatusWarningWidget :height="200" />
</template>
<script>
// import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import { StatusWarningWidget } from "@/dist/mantarray.common";

export default {
  components: {
    StatusWarningWidget,
  },
};
</script>
