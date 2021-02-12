<template>
  <div style="top: 50px; left: 88px; position: absolute">
    <CheckBoxWidget :checkbox_options="options"></CheckBoxWidget>
  </div>
</template>

<script>
import { CheckBoxWidget } from "@/dist/mantarray.common";
// import CheckBoxWidget from "@/components/basic_widgets/CheckBoxWidget.vue";

export default {
  components: {
    CheckBoxWidget,
  },
  data() {
    return {
      options: [
        { text: "Ascorbic Acid", value: "Ascorbic Acid" },
        { text: "b27", value: "b27" },
        { text: "B27 (-insulin)", value: "B27 (-insulin)", disabled: true },
        { text: "Lab-Exp-1", value: "Lab-Exp-1" },
      ],
    };
  },
  methods: {},
};
</script>
