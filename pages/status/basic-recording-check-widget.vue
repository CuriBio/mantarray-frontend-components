<template>
  <div>
    <button @click="open = !open">Show Modal</button>
    <b-modal
      v-if="open"
      id="recording-check"
      v-model="open"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <RecordingSnapshotWidget />
    </b-modal>
  </div>
</template>

<script>
// import { RecordingSnapshotWidget } from "@/dist/mantarray.common";
import RecordingSnapshotWidget from "@/components/status/RecordingSnapshotWidget.vue";
import { BModal } from "bootstrap-vue";
import BootstrapVue from "bootstrap-vue";
import Vue from "vue";

Vue.use(BootstrapVue);
Vue.component("BModal", BModal);

export default {
  components: {
    RecordingSnapshotWidget,
  },
  data() {
    return {
      open: false,
    };
  },
  created() {
    this.$store.commit("data/set_recording_snapshot_data", Array(24).fill([]));
  },
};
</script>
<style scoped>
button {
  height: 100px;
  width: 200px;
  background: rgb(17, 17, 17);
  color: #b7b7b7;
}
#recording-check {
  position: fixed;
  margin: 5% auto;
  top: 10%;
  left: 0;
  right: 0;
}
</style>
