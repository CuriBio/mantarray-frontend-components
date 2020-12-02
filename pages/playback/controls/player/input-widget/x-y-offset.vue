<template>
  <div style="top: 50px; left: 88px; position: absolute">
    <InputWidget
      :title_label="'Enter Alphanumeric ID'"
      :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
      :invalid_text="'This field is required'"
      :input_width="400"
    ></InputWidget>
  </div>
</template>

<script>
import { InputWidget } from "@/dist/mantarray.common";
// import InputWidget from "@/components/playback/controls/player/InputWidget.vue";
import Vue from "vue";

import uuid from "@tofandel/uuid-base62";
Vue.use(uuid);

export default {
  components: {
    InputWidget,
  },
};
</script>
