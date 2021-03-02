<template>
  <div>
    <div class="div__platemap-editor-backdrop"></div>
    <span class="span__platemap-editor-column-index-one"> 01</span>
    <span class="span__platemap-editor-column-index-two"> 02</span>
    <span class="span__platemap-editor-column-index-three"> 03</span>
    <span class="span__platemap-editor-column-index-four"> 04</span>
    <span class="span__platemap-editor-column-index-five">05</span
    ><span class="span__platemap-editor-column-index-six"> 06</span>
    <span class="span__platemap-editor-row-index-A"> A</span>
    <span class="span__platemap-editor-row-index-B"> B</span>
    <span class="span__platemap-editor-row-index-C"> C</span>
    <span class="span__platemap-editor-row-index-D"> D</span>
    <span
      class="span__platemap-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
    >
      <FontAwesomeIcon
        v-show="all_select_or_cancel"
        :icon="['fa', 'plus-circle']"
      />
      <FontAwesomeIcon
        v-show="!all_select_or_cancel"
        :icon="['fa', 'minus-circle']"
      />
    </span>
    <span
      v-for="well_index in Array(24).keys()"
      :key="well_index"
      :class="'well_' + well_index"
      width="66"
      height="66"
      @click.exact="basic_select(well_index)"
      @click.ctrl.exact="basic_shift_or_ctrl_select(well_index)"
      @click.shift.exact="basic_shift_or_ctrl_select(well_index)"
    >
      <PlateWell
        :classname="'plate_' + well_index"
        :svg_height="66"
        :svg_width="66"
        :circle_x="33"
        :circle_y="33"
        :radius="25"
        :strk="hover_color[well_index]"
        :plate_fill="platecolor[well_index]"
        :stroke_wdth="stroke_width[well_index]"
        :index="well_index"
        @enter-well="on_wellenter(well_index)"
        @leave-well="on_wellleave(well_index)"
      ></PlateWell>
    </span>
    <div v-show="testerf"></div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PlateWell from "@/components/basic_widgets/PlateWell.vue";
// import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";

// const twenty_four_well_labware_definition = new LabwareDefinition(4, 6);

// :stroke_wdth="!all_select[well_index] && hover[well_index] ? 0 : 4"

library.add(faMinusCircle);
library.add(faPlusCircle);
export default {
  name: "PlateMapEditor",
  components: { FontAwesomeIcon, PlateWell },
  props: {
    selected: {
      type: Array,
      default: function () {
        return new Array(24).fill(false);
      },
    },
    platecolor: {
      type: Array,
      default: function () {
        return new Array(24).fill("#b7b7b7");
      },
    },
  },
  data() {
    return {
      all_select_or_cancel: true,
      x_origin: 0,
      y_origin: 0,
      rect_width: 0,
      rect_height: 0,
      all_select: this.selected,
      hover: new Array(24).fill(false),
      hover_color: new Array(24).fill("#ececed"),
      stroke_width: new Array(24).fill(0),
      temp_stroke_width: [],
      testerf: false,
    };
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    for (let j = 0; j < this.all_select.length; j++) {
      this.stroke_width[j] = !this.all_select[j] ? 0 : 4;
    }
    const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
    this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
  },
  methods: {
    on_select_cancel_all(state) {
      this.all_select_or_cancel = !state;
      for (let count = 0; count < 24; count++) {
        this.all_select[count] = state;
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j] ? 0 : 4;
      }
      this.on_plate_well_selected();
    },

    // on_row_hover_enter(value) {
    //   this.hover_color = "#ececed";

    //   const row_index = value.charCodeAt(0) - 65;

    //   for (
    //     let column_index = 0;
    //     column_index < twenty_four_well_labware_definition.num_columns;
    //     column_index++
    //   ) {
    //     const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
    //       row_index,
    //       column_index
    //     );
    //     this.hover[well_index] = false;
    //   }
    // },
    // on_row_hover_leave(value) {
    //   this.hover_color = "#FFFFFF";
    //   const row_index = value.charCodeAt(0) - 65;

    //   for (
    //     let column_index = 0;
    //     column_index < twenty_four_well_labware_definition.num_columns;
    //     column_index++
    //   ) {
    //     const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
    //       row_index,
    //       column_index
    //     );
    //     this.hover[well_index] = true;
    //   }
    // },
    // on_column_hover_enter(value) {
    //   this.hover_color = "#ececed";

    //   const column_index = parseInt(value) - 1; // as incoming values start from 01

    //   for (
    //     let row_index = 0;
    //     row_index < twenty_four_well_labware_definition.num_rows;
    //     row_index++
    //   ) {
    //     const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
    //       row_index,
    //       column_index
    //     );
    //     this.hover[well_index] = false;
    //   }
    // },
    // on_column_hover_leave(value) {
    //   this.hover_color = "#FFFFFF";
    //   const column_index = parseInt(value) - 1; // as incoming values start from 01

    //   for (
    //     let row_index = 0;
    //     row_index < twenty_four_well_labware_definition.num_rows;
    //     row_index++
    //   ) {
    //     const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
    //       row_index,
    //       column_index
    //     );
    //     this.hover[well_index] = true;
    //   }
    // },
    basic_select(value) {
      const new_list = new Array(24).fill(false);

      new_list[value] = true;
      this.stroke_width[value] = 4;
      this.all_select = new_list;
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.on_wellenter(value);
      this.on_plate_well_selected();
    },
    basic_shift_or_ctrl_select(value) {
      this.testerf = !this.testerf;
      const allEqual = (arr) => arr.every((v) => v === arr[0]);
      this.all_select[value] = !this.all_select[value];
      this.stroke_width[value] = 4;
      if (allEqual(this.all_select)) {
        this.all_select_or_cancel = false;
      } else {
        this.all_select_or_cancel = true;
      }

      this.on_plate_well_selected();
    },
    on_wellenter(value) {
      this.hover[value] = true;
      this.hover_color[value] = "#ececed";
      // for(let i = 0; i < this.all_select.length; i++) {
      //     this.temp_stroke_width[i] = this.stroke_width[i];
      //   }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j] ? 0 : 4;
      }
      if (this.all_select[value] == true) {
        this.stroke_width[value] = 4;
      } else {
        this.stroke_width[value] = 2;
      }
    },
    on_wellleave(value) {
      this.hover[value] = false;
      this.hover_color[value] = "#FFFFFF";
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i] ? 0 : 4;
      }
    },
    on_plate_well_selected() {
      this.$emit("platewell-selected", this.all_select);
    },
  },
};
</script>
<style>
/*.well_not_selected {*/
/*  stroke-width: 0;*/
/*}*/
/*.well_selected {*/
/*  stroke-width: 2;*/
/*}*/

.div__platemap-editor-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 415px;
  height: 280px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  z-index: 1;
  pointer-events: all;
}

.div__platemap-drag-drop-selector {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 26px;
  margin: 0px;
  position: absolute;
  width: 400px;
  height: 265px;
  top: 0px;
  left: 0px;
  visibility: visible;
  z-index: 50;
  pointer-events: all;
}

.span__platemap-editor-column-index-one {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 35.9792px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 57;
}

.span__platemap-editor-column-index-one:hover,
.span__platemap-editor-column-index-two:hover,
.span__platemap-editor-column-index-three:hover,
.span__platemap-editor-column-index-four:hover,
.span__platemap-editor-column-index-five:hover,
.span__platemap-editor-column-index-six:hover,
.span__platemap-editor-row-index-A:hover,
.span__platemap-editor-row-index-B:hover,
.span__platemap-editor-row-index-C:hover,
.span__platemap-editor-row-index-D:hover {
  color: #ececed;
}

.span__platemap-toggle-plus-minus-icon:hover {
  color: #ffffff;
}

.span__platemap-editor-column-index-two {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 97.5836px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 59;
}
.span__platemap-editor-column-index-three {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 159.188px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 61;
}
.span__platemap-editor-column-index-four {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 220.792px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 63;
}
.span__platemap-editor-column-index-five {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 282.397px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 65;
}

.span__platemap-editor-column-index-six {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
  left: 344.001px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 67;
}
.span__platemap-editor-row-index-A {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: 41.928px;
  left: 7px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 51;
}
.span__platemap-editor-row-index-B {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: 103.621px;
  left: 7px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 51;
}
.span__platemap-editor-row-index-C {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: 165.779px;
  left: 7px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 55;
}
.span__platemap-editor-row-index-D {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: 224.1px;
  left: 7px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 53;
}
.span__platemap-toggle-plus-minus-icon {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  top: 5px;
  left: 5px;
  font-size: 20px;
  color: rgb(183, 183, 183);
  z-index: 53;
}
.well_0 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25px;
  left: 29.9792px;
  visibility: visible;
  z-index: 68;
}
.well_1 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 29.9792px;
  visibility: visible;
  z-index: 68;
}
.well_2 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 29.9792px;
  visibility: visible;
  z-index: 68;
}
.well_3 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.157px;
  left: 29.9792px;
  visibility: visible;
  z-index: 68;
}
.well_4 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25.427px;
  left: 91.5836px;
  visibility: visible;
  z-index: 68;
}
.well_5 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 91.5836px;
  visibility: visible;
  z-index: 68;
}
.well_6 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 91.5836px;
  visibility: visible;
  z-index: 68;
}
.well_7 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.203px;
  left: 91.5836px;
  visibility: visible;
  z-index: 68;
}
.well_8 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25.427px;
  left: 153.188px;
  visibility: visible;
  z-index: 68;
}
.well_9 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 153.188px;
  visibility: visible;
  z-index: 68;
}
.well_10 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 153.188px;
  visibility: visible;
  z-index: 68;
}
.well_11 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.203px;
  left: 153.188px;
  visibility: visible;
  z-index: 68;
}
.well_12 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25.427px;
  left: 214.792px;
  visibility: visible;
  z-index: 68;
}
.well_13 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 214.792px;
  visibility: visible;
  z-index: 68;
}

.well_14 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 214.792px;
  visibility: visible;
  z-index: 68;
}
.well_15 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.203px;
  left: 214.792px;
  visibility: visible;
  z-index: 68;
}
.well_16 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25.427px;
  left: 276.397px;
  visibility: visible;
  z-index: 68;
}
.well_17 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 276.397px;
  visibility: visible;
  z-index: 68;
}
.well_18 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 276.397px;
  visibility: visible;
  z-index: 68;
}
.well_19 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.203px;
  left: 276.397px;
  visibility: visible;
  z-index: 68;
}
.well_20 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 25.427px;
  left: 338.001px;
  visibility: visible;
  z-index: 68;
}
.well_21 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 85.3524px;
  left: 338.001px;
  visibility: visible;
  z-index: 68;
}
.well_22 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 145.278px;
  left: 338.001px;
  visibility: visible;
  z-index: 68;
}
.well_23 {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: 205.203px;
  left: 338.001px;
  visibility: visible;
  z-index: 68;
}
</style>
