<template>
  <div>
    <InputWidget
      :title_label="'Enter Alphanumeric ID'"
      :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
      :spellcheck="false"
      :invalid_text="'This field is required'"
      :input_width="400"
      :disabled="true"
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
