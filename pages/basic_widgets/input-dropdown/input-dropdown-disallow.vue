<template>
  <div>
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
      entrykey: "Customer Account 1",
      keyplaceholder: "Select User",
      error_text: "An ID is required",
      entry_width: 400,
      disallow_entry: true,
      nicknames_list: ["Customer Account 1", "Customer Account-2", "Customer Account-3"],
      on_empty_flag: false,
    };
  },
};
</script>
