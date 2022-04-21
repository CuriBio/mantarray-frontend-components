<template>
  <!-- <StatusWarningWidget :email_error="true" :modal_labels="short_circuit_labels" /> -->
  <!-- <StatusWarningWidget id="upload-modal" :modal_labels="sw_update_labels" /> -->
  <StimQCSummary />
</template>
<script>
// import StimQCSummary from "@/components/status/StimQCSummary.vue";
import { StimQCSummary } from "@/dist/mantarray.common";

export default {
  components: {
    StimQCSummary,
  },
  data() {
    return {};
  },
};
</script>
