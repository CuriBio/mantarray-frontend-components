<template>
  <div>
    <InputWidget
      :title_label="label"
      :placeholder="keyplaceholder"
      :spellcheck="spellchecking"
      :invalid_text="error_text"
      :value.sync="entrykey"
      :input_width="entry_width"
      :disabled="disallow_entry"
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
  data: function () {
    return {
      entrykey: "",
    };
  },
  watch: {
    entrykey() {
      let validation = false;
      if (this.entrykey.length < 2 && this.entrykey.length != 0) {
        this.error_text =
          "The entered text is " +
          this.entrykey.length +
          " character. All valid entries are 2 characters.";
        validation = false;
      }
      if (this.entrykey.length == 2) {
        this.error_text = "";
        validation = true;
      }
      if (this.entrykey.length > 2) {
        this.error_text =
          "The entered text is " +
          this.entrykey.length +
          " character. All valid entries are 2 characters.";
        validation = false;
      }
      return validation;
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
    this.disallow_entry = false;
  },
  methods: {},
};
</script>
