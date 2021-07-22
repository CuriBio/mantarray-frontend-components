<template>
  <div class="div__radio-button-group-background" style="top: 50px; left: 88px; position: absolute">
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
      button_names: ["Option A", "Option B", "Option C"],
    };
  },
};
</script>
<style>
.div__radio-button-group-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
</style>
