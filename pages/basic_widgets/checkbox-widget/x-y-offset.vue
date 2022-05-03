<template>
  <div class="div__check-background">
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
<style scoped>
.div__check-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 50px;
  left: 88px;
  font-size: 15px;
  color: rgb(183, 183, 183);
  visibility: visible;
  width: 140px;
  height: 150px;
  cursor: pointer;
  background: rgb(17, 17, 17);
  border: 2px solid rgb(17, 17, 17);
}
</style>
