<template>
  <div>
    <YAxisControls :height="'700px'" />
  </div>
</template>

<script>
import { YAxisControls } from "@/dist/mantarray.common";

export default {
  components: {
    YAxisControls,
  },
};
</script>
