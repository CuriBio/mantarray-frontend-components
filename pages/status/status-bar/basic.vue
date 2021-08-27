<template>
  <div @click="handle_random">
    <StatusBar :confirmation_request="random" @send_confirmation="send_confirmation" />
  </div>
</template>

<script>
import { StatusBar } from "@/dist/mantarray.common";
// import StatusBar from "@/components/status/StatusBar.vue";

import { STATUS } from "@/store/modules/flask/enums";

export default {
  components: {
    StatusBar,
  },
  data() {
    return { random: false };
  },
  created: function () {
    this.$store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATION_NEEDED);
  },
  methods: {
    handle_random: function () {
      this.random = true;
    },
    send_confirmation: function (idx) {
      console.log(idx);
    },
  },
};
</script>
