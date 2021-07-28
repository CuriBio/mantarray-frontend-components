<template>
  <div>
    <InputWidget
      :title_label="'Enter Alphanumeric ID'"
      :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
      :spellcheck="true"
      :invalid_text="error_text"
      :input_width="400"
      :disabled="false"
      @update:value="on_update($event)"
    ></InputWidget>
  </div>
</template>

<script>
import { InputWidget } from "@/dist/mantarray.common";
// import InputWidget from "@/components/playback/controls/player/InputWidget.vue";
import Vue from "vue";
import { TextValidation } from "@/js_utils/text_validation.js";
import uuid from "@tofandel/uuid-base62";
Vue.use(uuid);

const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");

export default {
  components: {
    InputWidget,
  },
  data: function () {
    return {
      error_text: "This field is required",
    };
  },
  methods: {
    on_update: function (new_value) {
      this.error_text = TextValidation_UUIDBase57.validate(new_value);
    },
  },
};
</script>
