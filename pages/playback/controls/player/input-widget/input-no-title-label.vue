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
      let current_validation = false;
      this.key_validation = current_validation;
      const len_alpahanumerickey = this.entrykey.length;
      if (this.entrykey.length == 22) {
        /* eslint-disable new-cap */
        uuid.customBase = new uuid.baseX(
          "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
        );
        /* eslint-enable new-cap */
        // decode the the value provided
        try {
          // decode the the value provided
          const decode_uuid = uuid.decode(this.entrykey);
          const encode_uuid = uuid.encode(decode_uuid);
          if (encode_uuid === this.entrykey) {
            this.uuid_errorfinder(len_alpahanumerickey, "valid");
            current_validation = true;
            this.key_validation = current_validation;
          } else {
            this.uuid_errorfinder(len_alpahanumerickey, "encoderror");
          }
        } catch (err) {
          this.uuid_errorfinder(len_alpahanumerickey, "error");
          current_validation = false;
          this.key_validation = current_validation;
        }
      } else {
        this.uuid_errorfinder(len_alpahanumerickey, "size");
      }
      return this.key_validation;
    },
  },
  created: function () {
    this.label = "";
    this.entrykey = "";
    this.keyplaceholder = "2VSckkBYr2An3dqHEyfRRE";
    this.spellchecking = false;
    this.error_text = "This field is required";
    this.key_validation = false;
    this.entry_width = 400;
    this.disallow_entry = false;
  },
  methods: {
    uuid_errorfinder(len, source) {
      let invalid_builder = "";
      let error = false;
      for (let i = 0; i < this.entrykey.length; i++) {
        const scan_ascii = this.entrykey.charCodeAt(i);
        if (scan_ascii === 48) {
          invalid_builder = invalid_builder + "0";
          error = true;
        }
        if (scan_ascii === 49) {
          invalid_builder = invalid_builder + "1";
          error = true;
        }
        if (scan_ascii === 73) {
          invalid_builder = invalid_builder + "I";
          error = true;
        }
        if (scan_ascii === 108) {
          invalid_builder = invalid_builder + "l";
          error = true;
        }
        if (scan_ascii === 79) {
          invalid_builder = invalid_builder + "O";
          error = true;
        }
        if (error === true) {
          invalid_builder = invalid_builder + ",";
          error = false;
        }
      }
      if (len < 22) {
        if (len == 0) {
          this.error_text = "This field is required";
        } else {
          this.error_text =
            "The entered ID is " +
            len +
            " characters. All valid IDs are exactly 22 characters.";
        }
      } else {
        if (invalid_builder != "") {
          this.error_text =
            "The entered ID has an invalid character " + invalid_builder;
        } else {
          if (source == "error") {
            this.error_text = "Entry permitted for Alphanumeric only";
          } else {
            if (source == "encoderror") {
              this.error_text =
                "This combination of 22 characters is invalid encoded id";
            } else {
              this.error_text = "";
            }
          }
        }
      }
      if (len > 22) {
        this.error_text =
          "The entered ID is " +
          len +
          " characters. All valid IDs are exactly 22 characters.";
      }
    },
  },
};
</script>
