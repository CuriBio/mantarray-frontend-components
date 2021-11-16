<template>
  <div>
    <UploadFilesWidget />
    <span id="test-1" style="top: 0px; position: absolute; left: 500px" @click="increment_uploaded_files"
      >uploaded file count</span
    >
    <span id="test-2" style="top: 0px; position: absolute; left: 700px" @click="increment_total_files"
      >total file count</span
    >
  </div>
</template>

<script>
import { UploadFilesWidget } from "@/dist/mantarray.common";
// import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    UploadFilesWidget,
  },
  methods: {
    increment_uploaded_files() {
      this.$store.commit("settings/set_file_count");
    },
    increment_total_files() {
      this.$store.commit("settings/set_total_file_count");
    },
  },
};
</script>
