<template>
  <div class="div__radio-button-group-background">
    <RadioButtonWidget
      :radio_buttons="button_names"
      :pre_selected="1"
      @radio-btn-selected="handle_radio_click"
    ></RadioButtonWidget>
    <div style="top: 100px; left: 108px; position: absolute">Label : {{ label }} Index : {{ index }}</div>
  </div>
</template>

<script>
import { RadioButtonWidget } from "@/dist/mantarray.common";
// import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";

export default {
  components: {
    RadioButtonWidget,
  },
  data() {
    return {
      button_names: [
        { text: "Daily", value: "Daily", disabled: false },
        { text: "Every 4 hours", value: "Every 4 hours", disabled: false },
        { text: "Every 12 hours", value: "Every 12 hours", disabled: false },
        { text: "Custom", value: "Custom", disabled: false },
      ],
      label: "",
      index: null,
    };
  },
  methods: {
    handle_radio_click: function (value) {
      this.label = value.name;
      this.index = value.index;
    },
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
