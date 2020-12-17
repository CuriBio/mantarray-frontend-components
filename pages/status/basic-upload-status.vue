<template>
  <div>
    <ComponentToTest :value="start" :max="max"></ComponentToTest>
  </div>
</template>

<script>
import { UploadFilesWidget as ComponentToTest } from "../../dist/mantarray.common";
// import ComponentToTest from "@/components/status/UploadFilesWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  data() {
    return {
      start: 0,
      max: 900,
      interval_id: 0,
    };
  },
  created: function () {
    this.interval_id = setInterval(this.strtincrement, 100);
  },
  methods: {
    strtincrement() {
      this.start = this.start + 1;
      if (this.start + 1 > this.max) {
        clearInterval(this.interval_id);
      }
    },
  },
};
</script>
