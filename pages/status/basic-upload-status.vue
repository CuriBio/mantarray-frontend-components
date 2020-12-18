<template>
  <div>
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { UploadFilesWidget as ComponentToTest } from "../../dist/mantarray.common";
// import ComponentToTest from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  created: function () {
    this.start = 800;
    this.max = 900;
    this.$store.commit("settings/set_file_count", this.start);
    this.$store.commit("settings/set_max_file_count", this.max);
    // this.interval_id = setInterval(this.strtincrement, 100);
  },
  methods: {
    // strtincrement() {
    //   this.start = this.start + 1;
    //   this.$store.commit("settings/set_file_count", this.start);
    //   if (this.start + 1 > this.max) {
    //     clearInterval(this.interval_id);
    //   }
    // },
  },
};
</script>
