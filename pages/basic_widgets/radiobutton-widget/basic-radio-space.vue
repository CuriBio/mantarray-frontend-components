<template>
  <div>
    <RadioButtonWidget :radio_buttons="button_names"></RadioButtonWidget>
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
      button_names: ["email", "phone"],
    };
  },
};
</script>
<style>
/* custom control is a class for the div which contains the radio button and label */
.custom-control {
  height: 80px;
}
</style>
