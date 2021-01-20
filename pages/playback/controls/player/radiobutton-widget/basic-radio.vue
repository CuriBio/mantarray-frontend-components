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
<style>
.div__input-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 150px;
  height: 400px;
  visibility: visible;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
</style>
