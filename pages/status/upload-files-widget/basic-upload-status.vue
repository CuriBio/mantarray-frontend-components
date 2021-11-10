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
// import { UploadFilesWidget as ComponentToTest } from "@/dist/mantarray.common";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    UploadFilesWidget,
  },
  created: function () {
    this.start = 0;
    this.max = 900;
    this.$store.commit("settings/set_file_count", this.start);
    this.$store.commit("settings/set_max_file_count");
  },
  methods: {
    midpointincrement() {
      this.start = 500;
      this.$store.commit("settings/set_file_count", this.start);
    },
    lastpointincrement() {
      this.start = 900;
      this.$store.commit("settings/set_file_count", this.start);
    },
  },
};
</script>
