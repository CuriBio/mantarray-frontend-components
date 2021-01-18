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
      test: 1,
      button_names: ["warm", "cool", "blue/red", "purple/green"],
    };
  },
  methods: {},
};
</script>
