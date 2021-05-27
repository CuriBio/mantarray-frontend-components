<template>
  <div style="top: 111px; left: 88px; position: absolute">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { StatusBar as ComponentToTest } from "@/dist/mantarray.common";
//  import ComponentToTest from "@/components/status/StatusBar.vue";
import { STATUS } from "@/store/modules/flask/enums";
export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATION_NEEDED);
  },
};
</script>
