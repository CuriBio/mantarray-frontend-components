<template>
  <div>
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
        { text: "", value: "Ascorbic Acid" },
        { text: "", value: "b27" },
        { text: "", value: "B27 (-insulin)" },
        { text: "", value: "Lab-Exp-1" },
      ],
    };
  },
  methods: {},
};
</script>
