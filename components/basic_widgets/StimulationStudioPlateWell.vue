<template>
  <div>
    <div
      class="div__simulationstudio-plate-well-location"
      :style="computed_style"
      @mouseenter="on_enter_well(index)"
      @mouseleave="on_leave_well(index)"
      @click.exact="on_click_exact(index)"
      @click.shift.exact="on_click_shift_exact(index)"
    >
      <PlateWell
        class="well"
        :svg_height="70"
        :svg_width="70"
        :circle_x="38"
        :circle_y="35"
        :radius="26"
        :strk="stroke"
        :plate_fill="protocol_fill"
        :stroke_wdth="stroke_wdth"
        :index="index"
        :fill-opacity="fill_opacity"
      />
      <svg
        v-if="disable"
        v-b-popover.hover.top="error_message"
        :title="'Disabled'"
        class="svg__open-circuit-container"
        viewBox="0 0 77 77"
      >
        <path
          :style="svg__open_circuit_outer__dynamic_class"
          d="M30.9,3.9a27,27,0,1,1-27,27,27,27,0,0,1,27-27m0-3.9A30.9,30.9,0,1,0,61.8,30.9,30.9,30.9,0,0,0,30.9,0Z"
        />
        <path
          class="svg__open-circuit"
          d="M17.3,28.8a2,2,0,0,1,2,2.1,2,2,0,0,1-2,2,2,2,0,0,1-2.1-2,2.1,2.1,0,0,1,2.1-2.1m0-4a6.1,6.1,0,1,0,6,6.1,6.1,6.1,0,0,0-6-6.1Z"
        />
        <path
          class="svg__open-circuit"
          d="M45.3,28.8a2,2,0,0,1,2,2.1,2,2,0,0,1-2,2,2,2,0,0,1-2.1-2,2.1,2.1,0,0,1,2.1-2.1m0-4a6.1,6.1,0,1,0,6,6.1,6.1,6.1,0,0,0-6-6.1Z"
        />
        <rect class="svg__open-circuit" x="3.5" y="28.9" width="8.3" height="4" />
        <rect
          class="svg__open-circuit"
          x="18.3"
          y="22.1"
          width="19.3"
          height="4"
          transform="translate(-8.8 26.8) rotate(-45)"
        />
        <rect class="svg__open-circuit" x="50.5" y="28.9" width="8.3" height="4" />
      </svg>
      <span
        v-if="!disable"
        class="span__simulationstudio-plate-well-protocol-location"
        :style="computed_label_left"
      >
        {{ protocol_type }}
      </span>
    </div>
  </div>
</template>
<script>
import PlateWell from "@/components/basic_widgets/PlateWell.vue";
import Vue from "vue";
import { VBPopover } from "bootstrap-vue";
Vue.directive("b-popover", VBPopover);
export default {
  name: "StimulationStudioPlateWell",
  components: {
    PlateWell,
  },
  props: {
    disable: { type: Boolean, default: false },
    stroke: { type: String, default: "" },
    protocol_fill: { type: String, default: "#B7B7B7" },
    stroke_wdth: { type: Number, default: 0 },
    display: { type: Boolean, default: false },
    index: {
      type: Number,
      default: 0,
      validator: (value) => {
        // Eli (2/5/21) The way this component currently computes the top/left positions requires that the index be within the valid range for a 24-well plate.
        return value >= 0 && value < 24;
      },
    },
    error_message: { type: String, default: "Open circuit found" },
    protocol_type: { type: String, default: "" },
  },
  computed: {
    /*   0 4  8 12 16 20     In order to speed the rendering its better to pre-compute
         1 5  9 13 17 21     top and left postions for the simulated well and center
         2 6 10 14 18 22
         3 7 11 15 19 23
                             The Stimulation studio, always comprises of 24 wells and placed in a japanese order,
                             as such left to right is a faster way and its quicker way of finding values and just
                             incrementing the left offset where in the top offset remains the same during rendering
                             but, our business logic of japanese order makes to recompute top and left offset to
                             arrange in the japanese order resulting in more computation.
                             So in order to reduce the same at present we compute the offset and return for left and top
                             as a result in the renderer the execution improves to a great extent

      */
    // Eli (2/5/21): The prop validator for ``index`` ensures that the value will always be between 0-23
    // eslint-disable-next-line vue/return-in-computed-property
    computed_top: function () {
      return 26 + (this.index % 4) * 60;
    },
    // Eli (2/5/21): The prop validator for ``index`` ensures that the value will always be between 0-23
    // eslint-disable-next-line vue/return-in-computed-property
    computed_left: function () {
      return 29 + Math.floor(this.index / 4) * 62;
    },
    computed_label_left: function () {
      return this.display ? "left: 29px;" : "left: 32px;";
    },
    computed_style: function () {
      return "top:" + this.computed_top + "px;" + "left:" + this.computed_left + "px;";
    },
    fill_opacity: function () {
      if (this.disable) return 0.3;
      else if (this.protocol_type) return 0.7;
      else return 1;
    },
    svg__open_circuit_outer__dynamic_class: function () {
      return this.stroke_wdth !== 0 ? "fill: #FFFFFF;" : "fill: rgb(228, 4, 4);";
    },
  },
  methods: {
    on_enter_well(index) {
      this.$emit("enter-well", index);
    },
    on_leave_well(index) {
      this.$emit("leave-well", index);
    },
    on_click_exact(index) {
      this.$emit("click-exact", index);
    },
    on_click_shift_exact(index) {
      this.$emit("click-shift-exact", index);
    },
  },
};
</script>
<style>
.div__simulationstudio-plate-well-location {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  visibility: visible;
}
.span__simulationstudio-plate-well-protocol-location {
  line-height: 100%;
  width: 20px;
  height: 20px;
  position: fixed;
  bottom: 19px;
  font-weight: bold;
  visibility: visible;
  font-family: Muli;
  color: rgb(255, 255, 255);
  cursor: pointer;
  text-shadow: -1px -1px 0 #6f7173, 1px -1px 0 #6f7173, -1px 1px 0 #6f7173, 1px 1px 0 #6f7173;
  /* creates a light outline for light protocol colors */
}
.div__popover-overlay {
  height: 50px;
  width: 50px;
  left: 15px;
  top: 10px;
  position: absolute;
}
.svg__open-circuit {
  fill: rgb(228, 4, 4);
}
.svg__open-circuit-container {
  position: relative;
  bottom: 62px;
  left: 12px;
}
</style>
