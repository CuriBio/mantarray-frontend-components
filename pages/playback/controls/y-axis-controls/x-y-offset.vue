<template>
  <div>
    <YAxisControls :css_top_anchor="'2px'" :css_left_anchor="'28px'" />
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
