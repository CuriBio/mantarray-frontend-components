<template>
  <div>
    <InputWidget
      :title_label="'Enter Alphanumeric ID'"
      :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
      :spellcheck="false"
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
      let validation = false;
      if (new_value.length < 2 && new_value.length != 0) {
        this.error_text =
          "The entered text is " + new_value.length + " character. All valid entries are 2 characters.";
        validation = false;
      }
      if (new_value.length == 2) {
        this.error_text = "";
        validation = true;
      }
      if (new_value.length > 2) {
        this.error_text =
          "The entered text is " + new_value.length + " character. All valid entries are 2 characters.";
        validation = false;
      }
      return validation;
    },
  },
};
</script>
