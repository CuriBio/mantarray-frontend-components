<template>
  <div>
    <div style="top: 50px; left: 88px; position: absolute">
      <InputDropDown
        :title_label="label"
        :placeholder="keyplaceholder"
        :invalid_text="error_text"
        :value.sync="entrykey"
        :input_width="entry_width"
        :disabled="disallow_entry"
        :options_text="nicknames_list"
        :message_if_invalid="on_empty_flag"
      ></InputDropDown>
    </div>
    <div class="input-selected-handler">
      The Input Option that was selected :<b>{{ option_choosen }}</b>
    </div>
  </div>
</template>

<script>
import { InputDropDown } from "@/dist/mantarray.common";
// import InputDropDown from "@/components/playback/controls/player/InputDropDown.vue";
export default {
  components: {
    InputDropDown,
  },
  data: function () {
    return {
      label: "User Selection",
      entrykey: "",
      keyplaceholder: "Select User",
      error_text: "An ID is required",
      entry_width: 400,
      disallow_entry: false,
      nicknames_list: ["Customer Account 1", "Customer Account-2", "Customer Account-3"],
      on_empty_flag: true,
    };
  },
  watch: {
    entrykey() {
      if (this.entrykey == "") {
        this.on_empty_flag = true;
      } else {
        const nickname_focus = this.nicknames_list.indexOf(this.entrykey);
        if (nickname_focus == -1) {
          this.on_empty_flag = true;
        } else {
          this.on_empty_flag = false;
          this.option_choosen = this.nicknames_list[nickname_focus];
        }
      }
    },
    methods: {},
  },
};
</script>
