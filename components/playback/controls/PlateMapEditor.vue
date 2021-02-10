<template>
  <div>
    <div class="div__platemap-editor-backdrop"></div>
    <span
      v-show="!a_column_toggle_one"
      class="span__platemap-editor-column-index-one"
      @click.exact="on_column_toggle('01')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('01')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('01')"
      @mouseenter="on_column_hover_enter('01')"
      @mouseleave="on_column_hover_leave('01')"
      >01</span
    >
    <span
      v-show="a_column_toggle_one"
      class="span__platemap-editor-column-index-one-negate"
      @click.exact="on_column_toggle('01')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('01')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('01')"
      @mouseenter="on_column_hover_enter('01')"
      @mouseleave="on_column_hover_leave('01')"
      >01</span
    >
    <span
      v-show="!a_column_toggle_two"
      class="span__platemap-editor-column-index-two"
      @click.exact="on_column_toggle('02')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('02')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('02')"
      @mouseenter="on_column_hover_enter('02')"
      @mouseleave="on_column_hover_leave('02')"
      >02</span
    >
    <span
      v-show="a_column_toggle_two"
      class="span__platemap-editor-column-index-two-negate"
      @click.exact="on_column_toggle('02')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('02')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('02')"
      @mouseenter="on_column_hover_enter('02')"
      @mouseleave="on_column_hover_leave('02')"
      >02</span
    >
    <span
      v-show="!a_column_toggle_three"
      class="span__platemap-editor-column-index-three"
      @click.exact="on_column_toggle('03')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('03')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('03')"
      @mouseenter="on_column_hover_enter('03')"
      @mouseleave="on_column_hover_leave('03')"
      >03</span
    >
    <span
      v-show="a_column_toggle_three"
      class="span__platemap-editor-column-index-three-negate"
      @click.exact="on_column_toggle('03')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('03')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('03')"
      @mouseenter="on_column_hover_enter('03')"
      @mouseleave="on_column_hover_leave('03')"
      >03</span
    >
    <span
      v-show="!a_column_toggle_four"
      class="span__platemap-editor-column-index-four"
      @click.exact="on_column_toggle('04')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('04')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('04')"
      @mouseenter="on_column_hover_enter('04')"
      @mouseleave="on_column_hover_leave('04')"
      >04</span
    >
    <span
      v-show="a_column_toggle_four"
      class="span__platemap-editor-column-index-four-negate"
      @click.exact="on_column_toggle('04')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('04')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('04')"
      @mouseenter="on_column_hover_enter('04')"
      @mouseleave="on_column_hover_leave('04')"
      >04</span
    >
    <span
      v-show="!a_column_toggle_five"
      class="span__platemap-editor-column-index-five"
      @click.exact="on_column_toggle('05')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('05')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('05')"
      @mouseenter="on_column_hover_enter('05')"
      @mouseleave="on_column_hover_leave('05')"
      >05</span
    >
    <span
      v-show="a_column_toggle_five"
      class="span__platemap-editor-column-index-five-negate"
      @click.exact="on_column_toggle('05')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('05')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('05')"
      @mouseenter="on_column_hover_enter('05')"
      @mouseleave="on_column_hover_leave('05')"
      >05</span
    >
    <span
      v-show="!a_column_toggle_six"
      class="span__platemap-editor-column-index-six"
      @click.exact="on_column_toggle('06')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle('06')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle('06')"
      @mouseenter="on_column_hover_enter('06')"
      @mouseleave="on_column_hover_leave('06')"
      >06</span
    >
    <span
      v-show="a_column_toggle_six"
      class="span__platemap-editor-column-index-six-negate"
      @click.exact="on_column_toggle('06')"
      @click.shift.exact="on_shift_or_ctrl_column_toggle_negate('06')"
      @click.ctrl.exact="on_shift_or_ctrl_column_toggle_negate('06')"
      @mouseenter="on_column_hover_enter('06')"
      @mouseleave="on_column_hover_leave('06')"
      >06</span
    >
    <span
      v-show="!a_row_toggle_A"
      class="span__platemap-editor-row-index-A"
      @click.exact="on_row_toggle('A')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle('A')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle('A')"
      @mouseenter="on_row_hover_enter('A')"
      @mouseleave="on_row_hover_leave('A')"
      >A</span
    >
    <span
      v-show="a_row_toggle_A"
      class="span__platemap-editor-row-index-A-negate"
      @click.exact="on_row_toggle('A')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle_negate('A')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle_negate('A')"
      @mouseenter="on_row_hover_enter('A')"
      @mouseleave="on_row_hover_leave('A')"
      >A</span
    >
    <span
      v-show="!a_row_toggle_B"
      class="span__platemap-editor-row-index-B"
      @click.exact="on_row_toggle('B')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle('B')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle('B')"
      @mouseenter="on_row_hover_enter('B')"
      @mouseleave="on_row_hover_leave('B')"
      >B</span
    >
    <span
      v-show="a_row_toggle_B"
      class="span__platemap-editor-row-index-B-negate"
      @click.exact="on_row_toggle('B')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle_negate('B')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle_negate('B')"
      @mouseenter="on_row_hover_enter('B')"
      @mouseleave="on_row_hover_leave('B')"
      >B</span
    >
    <span
      v-show="!a_row_toggle_C"
      class="span__platemap-editor-row-index-C"
      @click.exact="on_row_toggle('C')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle('C')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle('C')"
      @mouseenter="on_row_hover_enter('C')"
      @mouseleave="on_row_hover_leave('C')"
      >C</span
    >
    <span
      v-show="a_row_toggle_C"
      class="span__platemap-editor-row-index-C-negate"
      @click.exact="on_row_toggle('C')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle_negate('C')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle_negate('C')"
      @mouseenter="on_row_hover_enter('C')"
      @mouseleave="on_row_hover_leave('C')"
      >C</span
    >
    <span
      v-show="!a_row_toggle_D"
      class="span__platemap-editor-row-index-D"
      @click.exact="on_row_toggle('D')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle('D')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle('D')"
      @mouseenter="on_row_hover_enter('D')"
      @mouseleave="on_row_hover_leave('D')"
      >D</span
    >
    <span
      v-show="a_row_toggle_D"
      class="span__platemap-editor-row-index-D-negate"
      @click.exact="on_row_toggle('D')"
      @click.shift.exact="on_shift_or_ctrl_row_toggle_negate('D')"
      @click.ctrl.exact="on_shift_or_ctrl_row_toggle_negate('D')"
      @mouseenter="on_row_hover_enter('D')"
      @mouseleave="on_row_hover_leave('D')"
      >D</span
    >
    <span
      v-show="!all_toggle"
      class="span__platemap-toggle-plus-icon"
      @click="on_toggle_all()"
      @mouseenter="on_hover_all_enter()"
      @mouseleave="on_hover_all_leave()"
    >
      <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
    </span>
    <span
      v-show="all_toggle"
      class="span__platemap-toggle-minus-icon"
      @click="on_toggle_all()"
      @mouseenter="on_hover_all_enter()"
      @mouseleave="on_hover_all_leave()"
    >
      <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
    </span>
    <!-- <div class="div__platemap-drag-drop-selector" @mousedown="drag_startselect" @mousemove="track_position" @mouseup="drag_endselect">
      <svg width="400" height="260" v-show="a_drag_drop_toggle">
        <rect v-bind:x="x_origin" v-bind:y="y_origin" v-bind:width="rect_width" v-bind:height="rect_height"
          style="fill:none;stroke:#b7b7b7;stroke-width:1;fill-opacity:0.9;stroke-opacity:0.9" />
      </svg> -->
    <span
      v-for="well_index in Array(24).keys()"
      :key="well_index"
      :class="'well_' + well_index"
      width="66"
      height="66"
      @click.exact="basic_toggle(well_index)"
      @click.ctrl.exact="basic_shift_or_ctrl_toggle(well_index)"
      @click.shift.exact="basic_shift_or_ctrl_toggle(well_index)"
    >
      <PlateWell
        :classname="'plate_' + well_index"
        :svg_height="66"
        :svg_width="66"
        :circle_x="33"
        :circle_y="33"
        :radius="25"
        :strk="hover_color"
        :plate_fill="platecolor[well_index]"
        :stroke_wdth="!all_select[well_index] && hover[well_index] ? 0 : 4"
        :index="well_index"
        @enter-well="on_wellenter"
        @leave-well="on_wellleave"
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
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";

const twenty_four_well_labware_definition = new LabwareDefinition(4, 6);

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
      all_toggle: false,
      a_row_toggle_A: false,
      a_row_toggle_B: false,
      a_row_toggle_C: false,
      a_row_toggle_D: false,
      a_column_toggle_one: false,
      a_column_toggle_two: false,
      a_column_toggle_three: false,
      a_column_toggle_four: false,
      a_column_toggle_five: false,
      a_column_toggle_six: false,
      a_drag_drop_toggle: false,
      x_origin: 0,
      y_origin: 0,
      rect_width: 0,
      rect_height: 0,
      all_select: this.selected,
      hover: new Array(24).fill(true),
      hover_color: "#FFFFFF",
      testerf: false,
    };
  },
  methods: {
    on_toggle_all() {
      this.all_toggle = !this.all_toggle;
      for (let count = 0; count < 24; count++) {
        this.all_select[count] = this.all_toggle;
      }
      this.a_row_toggle_A = this.a_row_toggle_B = this.a_row_toggle_C = this.a_row_toggle_D = this.all_toggle;
      this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_five = this.a_column_toggle_six = this.all_toggle;
      this.on_plate_well_selected();
    },
    on_hover_all_enter() {
      this.hover_color = "#ececed";
      for (let count = 0; count < 24; count++) {
        this.hover[count] = false;
      }
    },
    on_hover_all_leave() {
      this.hover_color = "#FFFFFF";
      for (let count = 0; count < 24; count++) {
        this.hover[count] = true;
      }
    },
    on_row_toggle(value) {
      let row_toggle_flag = false;
      for (let i = 0; i < 24; i++) {
        this.all_select[i] = false;
      }
      this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_five = this.a_column_toggle_six = false;
      switch (value) {
        case "A":
          this.a_row_toggle_A = !this.a_row_toggle_A;
          row_toggle_flag = this.a_row_toggle_A;
          this.a_row_toggle_B = this.a_row_toggle_C = this.a_row_toggle_D = false;
          break;
        case "B":
          this.a_row_toggle_B = !this.a_row_toggle_B;
          row_toggle_flag = this.a_row_toggle_B;
          this.a_row_toggle_A = this.a_row_toggle_C = this.a_row_toggle_D = false;
          break;
        case "C":
          this.a_row_toggle_C = !this.a_row_toggle_C;
          row_toggle_flag = this.a_row_toggle_C;
          this.a_row_toggle_A = this.a_row_toggle_B = this.a_row_toggle_D = false;
          break;
        case "D":
          this.a_row_toggle_D = !this.a_row_toggle_D;
          row_toggle_flag = this.a_row_toggle_D;
          this.a_row_toggle_A = this.a_row_toggle_B = this.a_row_toggle_C = false;
          break;
      }
      const row_index = value.charCodeAt(0) - 65;
      for (
        let column_index = 0;
        column_index < twenty_four_well_labware_definition.num_columns;
        column_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.all_select[well_index] = row_toggle_flag;
      }
      this.on_plate_well_selected();
    },
    on_shift_or_ctrl_row_toggle(value) {
      switch (value) {
        case "A":
          this.a_row_toggle_A = !this.a_row_toggle_A;
          this.all_select[0] = this.a_column_toggle_one
            ? true
            : this.a_row_toggle_A;
          this.all_select[4] = this.a_column_toggle_two
            ? true
            : this.a_row_toggle_A;
          this.all_select[8] = this.a_column_toggle_three
            ? true
            : this.a_row_toggle_A;
          this.all_select[12] = this.a_column_toggle_four
            ? true
            : this.a_row_toggle_A;
          this.all_select[16] = this.a_column_toggle_five
            ? true
            : this.a_row_toggle_A;
          this.all_select[20] = this.a_column_toggle_six
            ? true
            : this.a_row_toggle_A;
          break;
        case "B":
          this.a_row_toggle_B = !this.a_row_toggle_B;
          this.all_select[1] = this.a_column_toggle_one
            ? true
            : this.a_row_toggle_B;
          this.all_select[5] = this.a_column_toggle_two
            ? true
            : this.a_row_toggle_B;
          this.all_select[9] = this.a_column_toggle_three
            ? true
            : this.a_row_toggle_B;
          this.all_select[13] = this.a_column_toggle_four
            ? true
            : this.a_row_toggle_B;
          this.all_select[17] = this.a_column_toggle_five
            ? true
            : this.a_row_toggle_B;
          this.all_select[21] = this.a_column_toggle_six
            ? true
            : this.a_row_toggle_B;
          break;
        case "C":
          this.a_row_toggle_C = !this.a_row_toggle_C;
          this.all_select[2] = this.a_column_toggle_one
            ? true
            : this.a_row_toggle_C;
          this.all_select[6] = this.a_column_toggle_two
            ? true
            : this.a_row_toggle_C;
          this.all_select[10] = this.a_column_toggle_three
            ? true
            : this.a_row_toggle_C;
          this.all_select[14] = this.a_column_toggle_four
            ? true
            : this.a_row_toggle_C;
          this.all_select[18] = this.a_column_toggle_five
            ? true
            : this.a_row_toggle_C;
          this.all_select[22] = this.a_column_toggle_six
            ? true
            : this.a_row_toggle_C;
          break;
        case "D":
          this.a_row_toggle_D = !this.a_row_toggle_D;
          this.all_select[3] = this.a_column_toggle_one
            ? true
            : this.a_row_toggle_D;
          this.all_select[7] = this.a_column_toggle_two
            ? true
            : this.a_row_toggle_D;
          this.all_select[11] = this.a_column_toggle_three
            ? true
            : this.a_row_toggle_D;
          this.all_select[15] = this.a_column_toggle_four
            ? true
            : this.a_row_toggle_D;
          this.all_select[19] = this.a_column_toggle_five
            ? true
            : this.a_row_toggle_D;
          this.all_select[23] = this.a_column_toggle_six
            ? true
            : this.a_row_toggle_D;
          break;
      }
      this.on_plate_well_selected();
    },
    on_shift_or_ctrl_row_toggle_negate(value) {
      switch (value) {
        case "A":
          this.a_row_toggle_A = !this.a_row_toggle_A;
          this.all_select[0] = this.a_column_toggle_one
            ? false
            : this.a_row_toggle_A;
          this.all_select[4] = this.a_column_toggle_two
            ? false
            : this.a_row_toggle_A;
          this.all_select[8] = this.a_column_toggle_three
            ? false
            : this.a_row_toggle_A;
          this.all_select[12] = this.a_column_toggle_four
            ? false
            : this.a_row_toggle_A;
          this.all_select[16] = this.a_column_toggle_five
            ? false
            : this.a_row_toggle_A;
          this.all_select[20] = this.a_column_toggle_six
            ? false
            : this.a_row_toggle_A;
          break;
        case "B":
          this.a_row_toggle_B = !this.a_row_toggle_B;
          this.all_select[1] = this.a_column_toggle_one
            ? false
            : this.a_row_toggle_B;
          this.all_select[5] = this.a_column_toggle_two
            ? false
            : this.a_row_toggle_B;
          this.all_select[9] = this.a_column_toggle_three
            ? false
            : this.a_row_toggle_B;
          this.all_select[13] = this.a_column_toggle_four
            ? false
            : this.a_row_toggle_B;
          this.all_select[17] = this.a_column_toggle_five
            ? false
            : this.a_row_toggle_B;
          this.all_select[21] = this.a_column_toggle_six
            ? false
            : this.a_row_toggle_B;
          break;
        case "C":
          this.a_row_toggle_C = !this.a_row_toggle_C;
          this.all_select[2] = this.a_column_toggle_one
            ? false
            : this.a_row_toggle_C;
          this.all_select[6] = this.a_column_toggle_two
            ? false
            : this.a_row_toggle_C;
          this.all_select[10] = this.a_column_toggle_three
            ? false
            : this.a_row_toggle_C;
          this.all_select[14] = this.a_column_toggle_four
            ? false
            : this.a_row_toggle_C;
          this.all_select[18] = this.a_column_toggle_five
            ? false
            : this.a_row_toggle_C;
          this.all_select[22] = this.a_column_toggle_six
            ? false
            : this.a_row_toggle_C;
          break;
        case "D":
          this.a_row_toggle_D = !this.a_row_toggle_D;
          this.all_select[3] = this.a_column_toggle_one
            ? false
            : this.a_row_toggle_D;
          this.all_select[7] = this.a_column_toggle_two
            ? false
            : this.a_row_toggle_D;
          this.all_select[11] = this.a_column_toggle_three
            ? false
            : this.a_row_toggle_D;
          this.all_select[15] = this.a_column_toggle_four
            ? false
            : this.a_row_toggle_D;
          this.all_select[19] = this.a_column_toggle_five
            ? false
            : this.a_row_toggle_D;
          this.all_select[23] = this.a_column_toggle_six
            ? false
            : this.a_row_toggle_D;
          break;
      }
      this.on_plate_well_selected();
    },
    on_row_hover_enter(value) {
      this.hover_color = "#ececed";

      const row_index = value.charCodeAt(0) - 65;

      for (
        let column_index = 0;
        column_index < twenty_four_well_labware_definition.num_columns;
        column_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.hover[well_index] = false;
      }
    },
    on_row_hover_leave(value) {
      this.hover_color = "#FFFFFF";
      const row_index = value.charCodeAt(0) - 65;

      for (
        let column_index = 0;
        column_index < twenty_four_well_labware_definition.num_columns;
        column_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.hover[well_index] = true;
      }
    },
    on_column_toggle(value) {
      let column_toggle_flag = false;
      for (let i = 0; i < 24; i++) {
        this.all_select[i] = false;
      }
      this.a_row_toggle_A = this.a_row_toggle_B = this.a_row_toggle_C = this.a_row_toggle_D = false;
      switch (value) {
        case "01":
          this.a_column_toggle_one = !this.a_column_toggle_one;
          column_toggle_flag = this.a_column_toggle_one;
          this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_five = this.a_column_toggle_six = false;
          break;
        case "02":
          this.a_column_toggle_two = !this.a_column_toggle_two;
          column_toggle_flag = this.a_column_toggle_two;
          this.a_column_toggle_one = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_five = this.a_column_toggle_six = false;
          break;
        case "03":
          this.a_column_toggle_three = !this.a_column_toggle_three;
          column_toggle_flag = this.a_column_toggle_three;
          this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_four = this.a_column_toggle_five = this.a_column_toggle_six = false;
          break;
        case "04":
          this.a_column_toggle_four = !this.a_column_toggle_four;
          column_toggle_flag = this.a_column_toggle_four;
          this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_five = this.a_column_toggle_six = false;
          break;
        case "05":
          this.a_column_toggle_five = !this.a_column_toggle_five;
          column_toggle_flag = this.a_column_toggle_five;
          this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_six = false;
          break;
        case "06":
          this.a_column_toggle_six = !this.a_column_toggle_six;
          column_toggle_flag = this.a_column_toggle_six;
          this.a_column_toggle_one = this.a_column_toggle_two = this.a_column_toggle_three = this.a_column_toggle_four = this.a_column_toggle_five = false;
          break;
      }
      const column_index = parseInt(value) - 1; // as incoming values start from 01
      for (
        let row_index = 0;
        row_index < twenty_four_well_labware_definition.num_rows;
        row_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.all_select[well_index] = column_toggle_flag;
      }
      this.on_plate_well_selected();
    },
    on_shift_or_ctrl_column_toggle(value) {
      switch (value) {
        case "01":
          this.a_column_toggle_one = !this.a_column_toggle_one;
          this.all_select[0] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_one;
          this.all_select[1] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_one;
          this.all_select[2] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_one;
          this.all_select[3] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_one;
          break;
        case "02":
          this.a_column_toggle_two = !this.a_column_toggle_two;
          this.all_select[4] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_two;
          this.all_select[5] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_two;
          this.all_select[6] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_two;
          this.all_select[7] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_two;
          break;
        case "03":
          this.a_column_toggle_three = !this.a_column_toggle_three;
          this.all_select[8] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_three;
          this.all_select[9] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_three;
          this.all_select[10] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_three;
          this.all_select[11] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_three;
          break;
        case "04":
          this.a_column_toggle_four = !this.a_column_toggle_four;
          this.all_select[12] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_four;
          this.all_select[13] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_four;
          this.all_select[14] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_four;
          this.all_select[15] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_four;
          break;
        case "05":
          this.a_column_toggle_five = !this.a_column_toggle_five;
          this.all_select[16] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_five;
          this.all_select[17] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_five;
          this.all_select[18] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_five;
          this.all_select[19] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_five;
          break;
        case "06":
          this.a_column_toggle_six = !this.a_column_toggle_six;
          this.all_select[20] = this.a_row_toggle_A
            ? true
            : this.a_column_toggle_six;
          this.all_select[21] = this.a_row_toggle_B
            ? true
            : this.a_column_toggle_six;
          this.all_select[22] = this.a_row_toggle_C
            ? true
            : this.a_column_toggle_six;
          this.all_select[23] = this.a_row_toggle_D
            ? true
            : this.a_column_toggle_six;
          break;
      }
      this.on_plate_well_selected();
    },
    on_shift_or_ctrl_column_toggle_negate(value) {
      switch (value) {
        case "01":
          this.a_column_toggle_one = !this.a_column_toggle_one;
          this.all_select[0] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_one;
          this.all_select[1] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_one;
          this.all_select[2] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_one;
          this.all_select[3] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_one;
          break;
        case "02":
          this.a_column_toggle_two = !this.a_column_toggle_two;
          this.all_select[4] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_two;
          this.all_select[5] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_two;
          this.all_select[6] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_two;
          this.all_select[7] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_two;
          break;
        case "03":
          this.a_column_toggle_three = !this.a_column_toggle_three;
          this.all_select[8] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_three;
          this.all_select[9] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_three;
          this.all_select[10] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_three;
          this.all_select[11] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_three;
          break;
        case "04":
          this.a_column_toggle_four = !this.a_column_toggle_four;
          this.all_select[12] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_four;
          this.all_select[13] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_four;
          this.all_select[14] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_four;
          this.all_select[15] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_four;
          break;
        case "05":
          this.a_column_toggle_five = !this.a_column_toggle_five;
          this.all_select[16] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_five;
          this.all_select[17] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_five;
          this.all_select[18] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_five;
          this.all_select[19] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_five;
          break;
        case "06":
          this.a_column_toggle_six = !this.a_column_toggle_six;
          this.all_select[20] = this.a_row_toggle_A
            ? false
            : this.a_column_toggle_six;
          this.all_select[21] = this.a_row_toggle_B
            ? false
            : this.a_column_toggle_six;
          this.all_select[22] = this.a_row_toggle_C
            ? false
            : this.a_column_toggle_six;
          this.all_select[23] = this.a_row_toggle_D
            ? false
            : this.a_column_toggle_six;
          break;
      }
      this.on_plate_well_selected();
    },
    on_column_hover_enter(value) {
      this.hover_color = "#ececed";

      const column_index = parseInt(value) - 1; // as incoming values start from 01

      for (
        let row_index = 0;
        row_index < twenty_four_well_labware_definition.num_rows;
        row_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.hover[well_index] = false;
      }
    },
    on_column_hover_leave(value) {
      this.hover_color = "#FFFFFF";
      const column_index = parseInt(value) - 1; // as incoming values start from 01

      for (
        let row_index = 0;
        row_index < twenty_four_well_labware_definition.num_rows;
        row_index++
      ) {
        const well_index = twenty_four_well_labware_definition.get_well_idx_from_row_and_column(
          row_index,
          column_index
        );
        this.hover[well_index] = true;
      }
    },
    basic_toggle(value) {
      const new_list = new Array(24).fill(false);
      new_list[value] = true;
      this.all_select = new_list;
      this.on_plate_well_selected();
    },
    basic_shift_or_ctrl_toggle(value) {
      this.testerf = !this.testerf;
      this.all_select[value] = !this.all_select[value];
      this.on_plate_well_selected();
    },
    // drag_startselect(event) {
    //   this.a_drag_drop_toggle = true;
    //   this.x_origin = event.pageX - 20;
    //   this.y_origin = event.pageY - 30;
    // },
    // track_position(event) {
    //   this.rect_width = event.pageX - this.x_origin;
    //   this.rect_height = event.pageY - this.y_origin;
    // },
    // drag_endselect(event) {
    //   this.rect_width = event.pageX - this.x_origin;
    //   this.rect_height = event.pageY - this.y_origin;
    //   this.a_drag_drop_toggle = false;
    // },
    on_wellenter(value) {
      this.hover[value] = false;
      this.hover_color = "#ececed";
    },
    on_wellleave(value) {
      this.hover[value] = true;
      this.hover_color = "#FFFFFF";
    },
    on_plate_well_selected() {
      this.$emit("platewell-selected", this.all_select);
    },
  },
};
</script>
<style>
.well_not_selected {
  stroke-width: 0;
}
.well_selected {
  stroke-width: 2;
}

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

.span__platemap-editor-column-index-one,
.span__platemap-editor-column-index-one-negate {
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
.span__platemap-editor-column-index-one-negate:hover,
.span__platemap-editor-column-index-two:hover,
.span__platemap-editor-column-index-two-negate:hover,
.span__platemap-editor-column-index-three:hover,
.span__platemap-editor-column-index-three-negate:hover,
.span__platemap-editor-column-index-four:hover,
.span__platemap-editor-column-index-four-negate:hover,
.span__platemap-editor-column-index-five:hover,
.span__platemap-editor-column-index-five-negate:hover,
.span__platemap-editor-column-index-six:hover,
.span__platemap-editor-column-index-six-negate:hover,
.span__platemap-editor-row-index-A:hover,
.span__platemap-editor-row-index-A-negate:hover,
.span__platemap-editor-row-index-B:hover,
.span__platemap-editor-row-index-B-negate:hover,
.span__platemap-editor-row-index-C:hover,
.span__platemap-editor-row-index-C-negate:hover,
.span__platemap-editor-row-index-D:hover,
.span__platemap-editor-row-index-D-negate:hover {
  color: #ececed;
}

.span__platemap-toggle-plus-icon:hover,
.span__platemap-toggle-minus-icon:hover {
  color: #ffffff;
}

.span__platemap-editor-column-index-two,
.span__platemap-editor-column-index-two-negate {
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
.span__platemap-editor-column-index-three,
.span__platemap-editor-column-index-three-negate {
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
.span__platemap-editor-column-index-four,
.span__platemap-editor-column-index-four-negate {
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
.span__platemap-editor-column-index-five,
.span__platemap-editor-column-index-five-negate {
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

.span__platemap-editor-column-index-six,
.span__platemap-editor-column-index-six-negate {
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
.span__platemap-editor-row-index-A,
.span__platemap-editor-row-index-A-negate {
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
.span__platemap-editor-row-index-B,
.span__platemap-editor-row-index-B-negate {
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
.span__platemap-editor-row-index-C,
.span__platemap-editor-row-index-C-negate {
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
.span__platemap-editor-row-index-D,
.span__platemap-editor-row-index-D-negate {
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
.span__platemap-toggle-plus-icon,
.span__platemap-toggle-minus-icon {
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
