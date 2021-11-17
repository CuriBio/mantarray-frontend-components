<template>
  <div>
    <UploadFilesWidget />
    <span id="test-3" style="top: 0px; position: absolute; left: 500px" @click="open_failed_status"
      >error</span
    >
    <span id="test-4" style="top: 0px; position: absolute; left: 700px" @click="open_successful_status"
      >success</span
    >
    <span id="test-5" style="top: 0px; position: absolute; left: 900px" @click="set_log_path">set path</span>
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
    open_failed_status() {
      this.$store.commit("settings/set_file_name", "failed_filename");
      this.$store.commit("settings/set_upload_error", true);
    },
    open_successful_status() {
      this.$store.commit("settings/set_file_name", "successful_filename");
      this.$store.commit("settings/set_file_count");
    },
    set_log_path() {
      const path = "C:\\Users\\CuriBio\\AppData\\Roaming\\MantarrayController\\logs_flask";
      this.$store.commit("settings/set_log_path", path);
    },
  },
};
</script>
