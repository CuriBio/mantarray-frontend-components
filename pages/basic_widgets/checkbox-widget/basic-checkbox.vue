<template>
  <div>
    <CheckBoxWidget :checkbox_options="options"></CheckBoxWidget>
  </div>
</template>

<script>
import { CheckBoxWidget } from "@/dist/mantarray.common";
// import CheckBoxWidget from "@/components/playback/controls/player/CheckBoxWidget.vue";

export default {
  components: {
    CheckBoxWidget,
  },
  data() {
    return {
      options: [
        { text: "Ascorbic  Acid", value: "Ascorbic Acid" },
        { text: "B27", value: "b27" },
        { text: "B27 (-insulin)", value: "b27_insulin", disabled: true },
        { text: "Lab-Exp-1", value: "lab_exp_1" },
      ],
    };
  },
  methods: {},
};
</script>
