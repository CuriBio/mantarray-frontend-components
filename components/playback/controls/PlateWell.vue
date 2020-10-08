<template>
  <svg :height="svg_height" :width="svg_width" :index="index">
    <circle
      :class="classname"
      :cx="circle_x"
      :cy="circle_y"
      :r="radius"
      :stroke="strk"
      :fill="plate_fill"
      :stroke-width="stroke_wdth"
      @mouseenter="on_enter_well(index)"
      @mouseleave="on_leave_well(index)"
    />
  </svg>
</template>
<script>
export default {
  name: "PlateWell",
  props: {
    classname: { type: String, default: "" },
    svg_height: { type: Number, default: 0 },
    svg_width: { type: Number, default: 0 },
    circle_x: { type: Number, default: 0 },
    circle_y: { type: Number, default: 0 },
    radius: { type: Number, default: 0 },
    strk: { type: String, default: "" },
    stroke_wdth: { type: Number, default: 0 },
    plate_fill: { type: String, default: "" },
    index: { type: Number, default: 0 },
  },
  methods: {
    on_enter_well(index) {
      this.$emit("enter-well", index);
    },
    on_leave_well(index) {
      this.$emit("leave-well", index);
    },
  },
};
</script>
<style></style>
