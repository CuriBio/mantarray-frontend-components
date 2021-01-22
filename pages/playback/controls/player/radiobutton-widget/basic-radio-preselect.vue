<template>
  <div>
    <RadioButtonWidget
      :radio_buttons="button_names"
      :pre_selected="1"
    ></RadioButtonWidget>
  </div>
</template>

<script>
import { RadioButtonWidget } from "@/dist/mantarray.common";
// import RadioButtonWidget from "@/components/playback/controls/player/RadioButtonWidget.vue";

export default {
  components: {
    RadioButtonWidget,
  },
  data() {
    return {
      button_names: ["warm", "cool", "blue/red", "purple/green"],
    };
  },
  methods: {},
};
</script>
<style></style>
