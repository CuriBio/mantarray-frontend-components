<template>
  <div>
    <YAxisControls :height="'100px'" />
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
