<template>
  <div style="top: 111px; position: absolute">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
// import ComponentToTest from "@/components/status/StatusBar.vue";
import { StatusBar as ComponentToTest } from "../../dist/mantarray.common";

import { STATUS } from "@/store/modules/flask/enums";

export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    this.$store.commit(
      "flask/set_status_uuid",
      STATUS.MESSAGE.CALIBRATION_NEEDED
    );
    setTimeout(this.reset_error, 10);
  },
  methods: {
    reset_error: function (event) {
      this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
    },
  },
};
</script>
