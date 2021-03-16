<template>
  <div>
    <div class="div__platemap-editor-backdrop"></div>
    <span
      v-for="column_index in 6"
      :key="column_index"
      class="span__platemap-editor-column-index"
      :style="
        'left:' + column_left_offset(column_values[column_index - 1]) + 'px;'
      "
    >
      <label
        :id="'column_' + column_index"
        @click.exact="on_column_select(column_values[column_index - 1])"
        @click.shift.exact="
          on_column_ctrl_click_or_shift_click(column_values[column_index - 1])
        "
        @click.ctrl.exact="
          on_column_ctrl_click_or_shift_click(column_values[column_index - 1])
        "
        @mouseenter="on_column_enter_hover(column_values[column_index - 1])"
        @mouseleave="on_column_leave_hover(column_values[column_index - 1])"
        >0{{ column_values[column_index - 1] }}</label
      >
    </span>

    <span
      v-for="row_index in 4"
      :key="row_index"
      class="span__platemap-editor-row-index"
      :style="'top:' + row_top_offset(row_values[row_index - 1]) + 'px;'"
    >
      <label
        :id="'row_' + row_index"
        @click.exact="on_row_select(row_values[row_index - 1])"
        @click.shift.exact="
          on_row_ctrl_click_or_shift_click(row_values[row_index - 1])
        "
        @click.ctrl.exact="
          on_row_ctrl_click_or_shift_click(row_values[row_index - 1])
        "
        @mouseenter="on_row_enter_hover(row_values[row_index - 1])"
        @mouseleave="on_row_leave_hover(row_values[row_index - 1])"
      >
        {{ row_values[row_index - 1] }}</label
      >
    </span>

    <span
      class="span__platemap-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
      @mouseenter="on_plus_minus_enter_hover(all_select_or_cancel)"
      @mouseleave="on_plus_minus_leave_hover(all_select_or_cancel)"
    >
      <FontAwesomeIcon
        v-show="all_select_or_cancel"
        id="plus"
        :icon="['fa', 'plus-circle']"
      />
      <FontAwesomeIcon
        v-show="!all_select_or_cancel"
        id="minus"
        :icon="['fa', 'minus-circle']"
      />
    </span>
    <span
      v-for="well_index in Array(24).keys()"
      :key="well_index"
      :class="'well_' + well_index"
      :style="well_top_left_offset(well_index)"
      width="66"
      height="66"
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
        @click-exact="basic_select(well_index)"
        @click-ctrl-exact="basic_shift_or_ctrl_select(well_index)"
        @click-shift-exact="basic_shift_or_ctrl_select(well_index)"
      ></PlateWell>
    </span>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PlateWell from "@/components/basic_widgets/PlateWell.vue";
library.add(faMinusCircle);
library.add(faPlusCircle);
const no_stroke_width = 0;
const hover_stroke_width = 2;
const selected_stroke_width = 4;
const hover_color = "#ececed";
const selected_color = "#FFFFFF";
const default_color = "#b7b7b7";
const debug_mode = undefined;
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
        return new Array(24).fill(default_color);
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
      hover_color: new Array(24).fill(hover_color),
      stroke_width: new Array(24).fill(no_stroke_width),
      temp_stroke_width: [],
      row_values: ["A", "B", "C", "D"],
      column_values: ["1", "2", "3", "4", "5", "6"],
      testerf: false,
    };
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    for (let j = 0; j < this.all_select.length; j++) {
      this.stroke_width[j] = !this.all_select[j]
        ? no_stroke_width
        : selected_stroke_width;
    }
    const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
    this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
  },
  methods: {
    column_left_offset(column) {
      switch (column) {
        case "1":
          return "35.9792";
        case "2":
          return "97.5836";
        case "3":
          return "159.188";
        case "4":
          return "220.792";
        case "5":
          return "282.397";
        case "6":
          return "344.001";
      }
    },
    row_top_offset(row) {
      switch (row) {
        case "A":
          return "41.928";
        case "B":
          return "103.621";
        case "C":
          return "165.779";
        case "D":
          return "224.1";
      }
    },
    well_top_left_offset(index) {
      switch (index) {
        case 0:
          return "top: 25px; left: 29.9792px;";
        case 1:
          return "top: 85.3524px; left: 29.9792px;";
        case 2:
          return "top: 145.278px; left: 29.9792px;";
        case 3:
          return "top: 205.157px; left: 29.9792px;";
        case 4:
          return "top: 25.427px; left: 91.5836px;";
        case 5:
          return "top: 85.3524px; left: 91.5836px;";
        case 6:
          return "top: 145.278px; left: 91.5836px;";
        case 7:
          return "top: 205.203px; left: 91.5836px;";
        case 8:
          return "top: 25.427px; left: 153.188px;";
        case 9:
          return "top: 85.3524px; left: 153.188px;";
        case 10:
          return "top: 145.278px; left: 153.188px;";
        case 11:
          return "top: 205.203px; left: 153.188px;";
        case 12:
          return "top: 25.427px; left: 214.792px;";
        case 13:
          return "top: 85.3524px; left: 214.792px;";
        case 14:
          return "top: 145.278px; left: 214.792px;";
        case 15:
          return "top: 205.203px; left: 214.792px;";
        case 16:
          return "top: 25.427px; left: 276.397px;";
        case 17:
          return "top: 85.3524px; left: 276.397px;";
        case 18:
          return "top: 145.278px; left: 276.397px;";
        case 19:
          return "top: 205.203px; left: 276.397px;";
        case 20:
          return "top: 25.427px; left: 338.001px;";
        case 21:
          return "top: 85.3524px; left: 338.001px;";
        case 22:
          return "top: 145.278px; left: 338.001px;";
        case 23:
          return "top: 205.203px; left: 338.001px;";
      }
    },
    on_select_cancel_all(state) {
      if (this.all_select_or_cancel == true) {
        this.test_event("+ icon clicked");
      } else {
        this.test_event("- icon clicked");
      }
      this.all_select_or_cancel = !state;
      for (let count = 0; count < 24; count++) {
        this.all_select[count] = state;
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[j] = !this.all_select[j]
          ? hover_color
          : selected_color;
      }
      this.on_plate_well_selected();
    },
    on_plus_minus_enter_hover(state) {
      if (state == true) {
        this.test_event("+ icon enter => Hover");
      } else {
        this.test_event("- icon enter => Hover");
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j]
          ? hover_stroke_width
          : selected_stroke_width;
      }
    },
    on_plus_minus_leave_hover(state) {
      if (state == true) {
        this.test_event("+ icon leave => Hover");
      } else {
        this.test_event("- icon leave => Hover");
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j]
          ? no_stroke_width
          : selected_stroke_width;
        if (state == false) {
          this.hover_color[j] = selected_color;
        }
      }
    },
    basic_select(value) {
      const new_list = new Array(24).fill(false);

      new_list[value] = true;
      this.test_event("Well clicked");
      this.stroke_width[value] = selected_stroke_width;
      this.all_select = new_list;
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.on_wellenter(value);
      this.on_plate_well_selected();
    },
    basic_shift_or_ctrl_select(value) {
      this.test_event("Well Shift or Ctrl clicked");
      this.testerf = !this.testerf;
      const allEqual = (arr) => arr.every((v) => v === true);
      this.all_select[value] = !this.all_select[value];
      this.stroke_width[value] = selected_stroke_width;
      if (allEqual(this.all_select)) {
        this.all_select_or_cancel = false;
      } else {
        this.all_select_or_cancel = true;
      }
      this.on_wellenter(value);
      this.on_plate_well_selected();
    },
    on_wellenter(value) {
      this.hover[value] = true;
      this.hover_color[value] = hover_color;
      this.stroke_width.splice(0, this.stroke_width.length);
      this.test_event("well enter =>" + value + " Hover");
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j]
          ? no_stroke_width
          : selected_stroke_width;
      }
      if (this.all_select[value] == true) {
        this.stroke_width[value] = selected_stroke_width;
      } else {
        this.stroke_width[value] = hover_stroke_width;
      }
    },
    on_wellleave(value) {
      this.hover[value] = false;
      this.hover_color[value] = selected_color;
      this.stroke_width.splice(0, this.stroke_width.length);
      this.test_event("well leave =>" + value + " Hover");
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
      }
    },
    on_row_select(row) {
      const new_list = new Array(24).fill(false);
      this.test_event(row + " clicked");
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (row) {
        case "A":
          new_list[0] = new_list[4] = new_list[8] = new_list[12] = new_list[16] = new_list[20] = true;
          break;
        case "B":
          new_list[1] = new_list[5] = new_list[9] = new_list[13] = new_list[17] = new_list[21] = true;
          break;
        case "C":
          new_list[2] = new_list[6] = new_list[10] = new_list[14] = new_list[18] = new_list[22] = true;
          break;
        case "D":
          new_list[3] = new_list[7] = new_list[11] = new_list[15] = new_list[19] = new_list[23] = true;
          break;
      }
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.all_select = new_list;
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
      this.on_plate_well_selected();
    },
    on_column_select(column) {
      const new_list = new Array(24).fill(false);
      this.test_event(column + " clicked");
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (column) {
        case "1":
          new_list[0] = new_list[1] = new_list[2] = new_list[3] = true;
          break;
        case "2":
          new_list[4] = new_list[5] = new_list[6] = new_list[7] = true;
          break;
        case "3":
          new_list[8] = new_list[9] = new_list[10] = new_list[11] = true;
          break;
        case "4":
          new_list[12] = new_list[13] = new_list[14] = new_list[15] = true;
          break;
        case "5":
          new_list[16] = new_list[17] = new_list[18] = new_list[19] = true;
          break;
        case "6":
          new_list[20] = new_list[21] = new_list[22] = new_list[23] = true;
          break;
      }
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.all_select = new_list;
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
      this.on_plate_well_selected();
    },
    on_row_ctrl_click_or_shift_click(row) {
      const new_list = [];
      let result = false;
      this.test_event(row + " ctrl or shift clicked");
      for (let j = 0; j < this.all_select.length; j++)
        new_list[j] = this.all_select[j];
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (row) {
        case "A":
          result =
            new_list[0] &&
            new_list[4] &&
            new_list[8] &&
            new_list[12] &&
            new_list[16] &&
            new_list[20];
          if (result == true) {
            new_list[0] = new_list[4] = new_list[8] = new_list[12] = new_list[16] = new_list[20] = false;
          } else {
            new_list[0] = new_list[4] = new_list[8] = new_list[12] = new_list[16] = new_list[20] = true;
          }
          break;
        case "B":
          result =
            new_list[1] &&
            new_list[5] &&
            new_list[9] &&
            new_list[13] &&
            new_list[17] &&
            new_list[21];
          if (result == true) {
            new_list[1] = new_list[5] = new_list[9] = new_list[13] = new_list[17] = new_list[21] = false;
          } else {
            new_list[1] = new_list[5] = new_list[9] = new_list[13] = new_list[17] = new_list[21] = true;
          }
          break;
        case "C":
          result =
            new_list[2] &&
            new_list[6] &&
            new_list[10] &&
            new_list[14] &&
            new_list[18] &&
            new_list[22];
          if (result == true) {
            new_list[2] = new_list[6] = new_list[10] = new_list[14] = new_list[18] = new_list[22] = false;
          } else {
            new_list[2] = new_list[6] = new_list[10] = new_list[14] = new_list[18] = new_list[22] = true;
          }
          break;
        case "D":
          result =
            new_list[3] &&
            new_list[7] &&
            new_list[11] &&
            new_list[15] &&
            new_list[19] &&
            new_list[23];
          if (result == true) {
            new_list[3] = new_list[7] = new_list[11] = new_list[15] = new_list[19] = new_list[23] = false;
          } else {
            new_list[3] = new_list[7] = new_list[11] = new_list[15] = new_list[19] = new_list[23] = true;
          }
          break;
      }

      this.all_select = new_list;
      const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
      this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.

      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
      this.on_plate_well_selected();
    },
    on_column_ctrl_click_or_shift_click(column) {
      this.test_event(column + " ctrl or shift clicked");
      const new_list = [];
      let result = false;
      for (let j = 0; j < this.all_select.length; j++)
        new_list[j] = this.all_select[j];
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (column) {
        case "1":
          result = new_list[0] && new_list[1] && new_list[2] && new_list[3];
          if (result == true) {
            new_list[0] = new_list[1] = new_list[2] = new_list[3] = false;
          } else {
            new_list[0] = new_list[1] = new_list[2] = new_list[3] = true;
          }
          break;
        case "2":
          result = new_list[4] && new_list[5] && new_list[6] && new_list[7];
          if (result == true) {
            new_list[4] = new_list[5] = new_list[6] = new_list[7] = false;
          } else {
            new_list[4] = new_list[5] = new_list[6] = new_list[7] = true;
          }
          break;
        case "3":
          result = new_list[8] && new_list[9] && new_list[10] && new_list[11];
          if (result == true) {
            new_list[8] = new_list[9] = new_list[10] = new_list[11] = false;
          } else {
            new_list[8] = new_list[9] = new_list[10] = new_list[11] = true;
          }
          break;
        case "4":
          result = new_list[12] && new_list[13] && new_list[14] && new_list[15];
          if (result == true) {
            new_list[12] = new_list[13] = new_list[14] = new_list[15] = false;
          } else {
            new_list[12] = new_list[13] = new_list[14] = new_list[15] = true;
          }
          break;
        case "5":
          result = new_list[16] && new_list[17] && new_list[18] && new_list[19];
          if (result == true) {
            new_list[16] = new_list[17] = new_list[18] = new_list[19] = false;
          } else {
            new_list[16] = new_list[17] = new_list[18] = new_list[19] = true;
          }
          break;
        case "6":
          result = new_list[20] && new_list[21] && new_list[22] && new_list[23];
          if (result == true) {
            new_list[20] = new_list[21] = new_list[22] = new_list[23] = false;
          } else {
            new_list[20] = new_list[21] = new_list[22] = new_list[23] = true;
          }
          break;
      }

      this.all_select = new_list;
      const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
      this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.

      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
      this.on_plate_well_selected();
    },
    on_column_enter_hover(value) {
      this.test_event(value + " hover enter");
      const new_list = [];
      for (let i = 0; i < this.stroke_width.length; i++)
        new_list[i] = this.stroke_width[i];
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (value) {
        case "1":
          new_list[0] =
            new_list[0] == no_stroke_width ? hover_stroke_width : new_list[0];
          new_list[1] =
            new_list[1] == no_stroke_width ? hover_stroke_width : new_list[1];
          new_list[2] =
            new_list[2] == no_stroke_width ? hover_stroke_width : new_list[2];
          new_list[3] =
            new_list[3] == no_stroke_width ? hover_stroke_width : new_list[3];
          break;
        case "2":
          new_list[4] =
            new_list[4] == no_stroke_width ? hover_stroke_width : new_list[4];
          new_list[5] =
            new_list[5] == no_stroke_width ? hover_stroke_width : new_list[5];
          new_list[6] =
            new_list[6] == no_stroke_width ? hover_stroke_width : new_list[6];
          new_list[7] =
            new_list[7] == no_stroke_width ? hover_stroke_width : new_list[7];
          break;
        case "3":
          new_list[8] =
            new_list[8] == no_stroke_width ? hover_stroke_width : new_list[8];
          new_list[9] =
            new_list[9] == no_stroke_width ? hover_stroke_width : new_list[9];
          new_list[10] =
            new_list[10] == no_stroke_width ? hover_stroke_width : new_list[10];
          new_list[11] =
            new_list[11] == no_stroke_width ? hover_stroke_width : new_list[11];
          break;
        case "4":
          new_list[12] =
            new_list[12] == no_stroke_width ? hover_stroke_width : new_list[12];
          new_list[13] =
            new_list[13] == no_stroke_width ? hover_stroke_width : new_list[13];
          new_list[14] =
            new_list[14] == no_stroke_width ? hover_stroke_width : new_list[14];
          new_list[15] =
            new_list[15] == no_stroke_width ? hover_stroke_width : new_list[15];
          break;
        case "5":
          new_list[16] =
            new_list[16] == no_stroke_width ? hover_stroke_width : new_list[16];
          new_list[17] =
            new_list[17] == no_stroke_width ? hover_stroke_width : new_list[17];
          new_list[18] =
            new_list[18] == no_stroke_width ? hover_stroke_width : new_list[18];
          new_list[19] =
            new_list[19] == no_stroke_width ? hover_stroke_width : new_list[19];
          break;
        case "6":
          new_list[20] =
            new_list[20] == no_stroke_width ? hover_stroke_width : new_list[20];
          new_list[21] =
            new_list[21] == no_stroke_width ? hover_stroke_width : new_list[21];
          new_list[22] =
            new_list[22] == no_stroke_width ? hover_stroke_width : new_list[22];
          new_list[23] =
            new_list[23] == no_stroke_width ? hover_stroke_width : new_list[23];
          break;
      }
      for (let j = 0; j < new_list.length; j++)
        this.stroke_width[j] = new_list[j];
    },
    on_column_leave_hover(value) {
      this.test_event(value + " hover leave");
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
    },
    on_row_enter_hover(value) {
      this.test_event(value + " hover enter");
      const new_list = [];
      for (let i = 0; i < this.stroke_width.length; i++)
        new_list[i] = this.stroke_width[i];
      this.stroke_width.splice(0, this.stroke_width.length);
      switch (value) {
        case "A":
          new_list[0] =
            new_list[0] == no_stroke_width ? hover_stroke_width : new_list[0];
          new_list[4] =
            new_list[4] == no_stroke_width ? hover_stroke_width : new_list[4];
          new_list[8] =
            new_list[8] == no_stroke_width ? hover_stroke_width : new_list[8];
          new_list[12] =
            new_list[12] == no_stroke_width ? hover_stroke_width : new_list[12];
          new_list[16] =
            new_list[16] == no_stroke_width ? hover_stroke_width : new_list[16];
          new_list[20] =
            new_list[20] == no_stroke_width ? hover_stroke_width : new_list[20];
          break;
        case "B":
          new_list[1] =
            new_list[1] == no_stroke_width ? hover_stroke_width : new_list[1];
          new_list[5] =
            new_list[5] == no_stroke_width ? hover_stroke_width : new_list[5];
          new_list[9] =
            new_list[9] == no_stroke_width ? hover_stroke_width : new_list[9];
          new_list[13] =
            new_list[13] == no_stroke_width ? hover_stroke_width : new_list[13];
          new_list[17] =
            new_list[17] == no_stroke_width ? hover_stroke_width : new_list[17];
          new_list[21] =
            new_list[21] == no_stroke_width ? hover_stroke_width : new_list[21];
          break;
        case "C":
          new_list[2] =
            new_list[2] == no_stroke_width ? hover_stroke_width : new_list[2];
          new_list[6] =
            new_list[6] == no_stroke_width ? hover_stroke_width : new_list[6];
          new_list[10] =
            new_list[10] == no_stroke_width ? hover_stroke_width : new_list[10];
          new_list[14] =
            new_list[14] == no_stroke_width ? hover_stroke_width : new_list[14];
          new_list[18] =
            new_list[18] == no_stroke_width ? hover_stroke_width : new_list[18];
          new_list[22] =
            new_list[22] == no_stroke_width ? hover_stroke_width : new_list[22];
          break;
        case "D":
          new_list[3] =
            new_list[3] == no_stroke_width ? hover_stroke_width : new_list[3];
          new_list[7] =
            new_list[7] == no_stroke_width ? hover_stroke_width : new_list[7];
          new_list[11] =
            new_list[11] == no_stroke_width ? hover_stroke_width : new_list[11];
          new_list[15] =
            new_list[15] == no_stroke_width ? hover_stroke_width : new_list[15];
          new_list[19] =
            new_list[19] == no_stroke_width ? hover_stroke_width : new_list[19];
          new_list[23] =
            new_list[23] == no_stroke_width ? hover_stroke_width : new_list[23];
          break;
      }
      for (let j = 0; j < new_list.length; j++)
        this.stroke_width[j] = new_list[j];
    },
    on_row_leave_hover(value) {
      this.test_event(value + " hover leave");
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i]
          ? no_stroke_width
          : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i]
          ? hover_color
          : selected_color;
      }
    },
    on_plate_well_selected() {
      this.$emit("platewell-selected", this.all_select);
    },
    test_event(evnt) {
      if (debug_mode != undefined) {
        this.$emit("test-event", evnt);
      }
    },
  },
};
</script>
<style>
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
  pointer-events: all;
}

.span__platemap-editor-column-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 2px;
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
}

.span__platemap-editor-column-index label:hover,
.span__platemap-editor-row-index-A label:hover,
.span__platemap-editor-row-index-B label:hover,
.span__platemap-editor-row-index-C label:hover,
.span__platemap-editor-row-index-D label:hover,
.span__platemap-editor-row-index label:hover {
  color: #ececed;
}

.span__platemap-toggle-plus-minus-icon:hover {
  color: #ffffff;
}

.span__platemap-editor-row-index-A,
.span__platemap-editor-row-index-B,
.span__platemap-editor-row-index-C,
.span__platemap-editor-row-index-D,
.span__platemap-editor-row-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
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
}
.well_0,
.well_1,
.well_2,
.well_3,
.well_4,
.well_5,
.well_6,
.well_7,
.well_8,
.well_9,
.well_10,
.well_11,
.well_12,
.well_13,
.well_14,
.well_15,
.well_16,
.well_17,
.well_18,
.well_19,
.well_20,
.well_21,
.well_22,
.well_23 {
  pointer-events: all;
  border-radius: 50%;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  visibility: visible;
}
</style>
