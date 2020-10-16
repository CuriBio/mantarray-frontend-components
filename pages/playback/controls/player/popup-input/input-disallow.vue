<template>
  <div>
    <PopInput
      :title_label="label"
      :placeholder="keyplaceholder"
      :spellcheck="spellchecking"
      :invalid_text="error_text"
      :value.sync="entrykey"
      :input_width="entry_width"
      :disabled="disallow_entry"
    ></PopInput>
  </div>
</template>

<script>
import { PopInput } from "@/dist/mantarray.common";
// import PopInput from "@/components/playback/controls/player/PopInput.vue";
import Vue from "vue";

import uuid from "@tofandel/uuid-base62";
Vue.use(uuid);

export default {
  components: {
    PopInput,
  },
  data: function () {
    return {
      entrykey: "",
    };
  },
  watch: {
    entrykey() {
      // No function call back would happen as input is disabled
    },
  },
  created: function () {
    this.label = "Enter Alphanumeric ID";
    this.entrykey = "";
    this.keyplaceholder = "2VSckkBYr2An3dqHEyfRRE";
    this.spellchecking = false;
    this.error_text = "This field is required";
    this.key_validation = false;
    this.entry_width = 400;
    this.disallow_entry = true;
  },
  methods: {},
};
</script>
