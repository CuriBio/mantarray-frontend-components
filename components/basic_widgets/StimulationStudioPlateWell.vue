<template>
  <div>
    <div
      class="div__simulationstudio-plate-well-location"
      :style="'top:' + computed_top + 'px;' + 'left:' + computed_left + 'px;'"
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
      ></PlateWell>
      <span :class="'span__simulationstudio-plate-well-protocol-location'">
        {{ protocol_type }}
      </span>
    </div>
  </div>
</template>
<script>
import PlateWell from "@/components/basic_widgets/PlateWell.vue";
export default {
  name: "StimulationStudioPlateWell",
  components: {
    PlateWell,
  },
  props: {
    stroke: { type: String, default: "" },
    protocol_fill: { type: String, default: "" },
    stroke_wdth: { type: Number, default: 0 },
    index: {
      type: Number,
      default: 0,
      validator: (value) => {
        // Eli (2/5/21) The way this component currently computes the top/left positions requires that the index be within the valid range for a 24-well plate.
        return value >= 0 && value < 24;
      },
    },
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
                             but, our bussiness logic of japanese order makes to recompute top and left offset to
                             arrange in the japanese order resulting in more computation.
                             So in order to reduce the same at present we compute the offset and return for left and top
                             as a result in the renderer the execution improves to a great extent

      */
    // Eli (2/5/21): The prop validator for ``index`` ensures that the value will always be between 0-23
    // eslint-disable-next-line vue/return-in-computed-property
    computed_top: function () {
      switch (this.index) {
        case 0:
        case 4:
        case 8:
        case 12:
        case 16:
        case 20:
          return 26;
        case 1:
        case 5:
        case 9:
        case 13:
        case 17:
        case 21:
          return 86;
        case 2:
        case 6:
        case 10:
        case 14:
        case 18:
        case 22:
          return 146;
        case 3:
        case 7:
        case 11:
        case 15:
        case 19:
        case 23:
          return 206;
      }
    },
    // Eli (2/5/21): The prop validator for ``index`` ensures that the value will always be between 0-23
    // eslint-disable-next-line vue/return-in-computed-property
    computed_left: function () {
      switch (this.index) {
        case 0:
        case 1:
        case 2:
        case 3:
          return 30;
        case 4:
        case 5:
        case 6:
        case 7:
          return 91;
        case 8:
        case 9:
        case 10:
        case 11:
          return 153;
        case 12:
        case 13:
        case 14:
        case 15:
          return 215;
        case 16:
        case 17:
        case 18:
        case 19:
          return 277;
        case 20:
        case 21:
        case 22:
        case 23:
          return 339;
      }
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
  /* z-index: 8; */
}
.span__simulationstudio-plate-well-protocol-location {
  line-height: 100%;
  width: 20px;
  height: 20px;
  position: fixed;
  left: 33px;
  bottom: 19px;
  font-weight: bold;
  visibility: visible;
  font-family: Muli;
  color: rgb(255, 255, 255);
  cursor: pointer;
}
</style>
