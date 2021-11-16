<template>
  <div>
    <UploadFilesWidget />
    <span id="test-1" style="top: 0px; position: absolute; left: 500px" @click="midpointincrement"
      >mid point</span
    >
    <span id="test-2" style="top: 0px; position: absolute; left: 700px" @click="lastpointincrement"
      >last point</span
    >
  </div>
</template>

<script>
// import { UploadFilesWidget } from "@/dist/mantarray.common";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    UploadFilesWidget,
  },
  methods: {
    midpointincrement() {
      this.$store.commit("settings/set_file_count");
    },
    lastpointincrement() {
      this.$store.commit("settings/set_total_file_count");
    },
  },
};
</script>
