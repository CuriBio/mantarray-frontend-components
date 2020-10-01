<template>
  <div>
    <WebPlayerControls
      :create_with_vuex_in_stopped_state="true"
    ></WebPlayerControls>
  </div>
</template>

<script>
import { WebPlayerControls } from "../../../../../dist/mantarray.common";

export default {
  components: {
    WebPlayerControls,
  },
};
</script>
