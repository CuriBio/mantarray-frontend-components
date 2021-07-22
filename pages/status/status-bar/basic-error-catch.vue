<template>
  <div style="top: 111px; position: absolute">
    <ComponentToTest></ComponentToTest>
    <span id="test" style="top: 0px; position: absolute; left: 800px" @click="reset_error">Click me</span>
  </div>
</template>

<script>
// import ComponentToTest from "@/components/status/StatusBar.vue";
import { StatusBar as ComponentToTest } from "@/dist/mantarray.common";

import { STATUS } from "@/store/modules/flask/enums";

export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATION_NEEDED);
  },
  methods: {
    reset_error: function (event) {
      this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
    },
  },
};
</script>
