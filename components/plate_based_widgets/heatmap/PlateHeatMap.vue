<template>
  <div>
    <div class="div__heatmap-editor-backdrop"></div>
    <span
      v-for="column_index in 6"
      :key="'column_' + column_index"
      class="span__heatmap-editor-column-index"
      :style="'left:' + column_left_offset(column_values[column_index - 1]) + 'px;'"
    >
      <label
        :id="'column_' + column_index"
        @click.exact="on_column_select(column_index - 1)"
        @click.shift.exact="on_column_ctrl_click_or_shift_click(column_index - 1)"
        @mouseenter="on_column_enter_hover(column_index - 1)"
        @mouseleave="on_column_leave_hover(column_index - 1)"
        >0{{ column_values[column_index - 1] }}</label
      >
    </span>

    <span
      v-for="row_index in 4"
      :key="'row_' + row_index"
      class="span__heatmap-editor-row-index"
      :style="'top:' + row_top_offset(row_values[row_index - 1]) + 'px;'"
    >
      <label
        :id="'row_' + row_index"
        @click.exact="on_row_select(row_index - 1)"
        @click.shift.exact="on_row_ctrl_click_or_shift_click(row_index - 1)"
        @mouseenter="on_row_enter_hover(row_index - 1)"
        @mouseleave="on_row_leave_hover(row_index - 1)"
      >
        {{ row_values[row_index - 1] }}</label
      >
    </span>

    <span
      class="span__heatmap-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
      @mouseenter="on_plus_minus_enter_hover(all_select_or_cancel)"
      @mouseleave="on_plus_minus_leave_hover(all_select_or_cancel)"
    >
      <FontAwesomeIcon v-show="all_select_or_cancel" id="plus" :icon="['fa', 'plus-circle']" />
      <FontAwesomeIcon v-show="!all_select_or_cancel" id="minus" :icon="['fa', 'minus-circle']" />
    </span>
    <span
      v-for="well_index in Array(24).keys()"
      :key="well_index"
      :class="'well_' + well_index"
      :style="well_top_left_offset(well_index)"
      width="103"
      height="103"
    >
      <PlateWell
        :id="'well_' + well_index"
        :svg_height="103"
        :svg_width="103"
        :circle_x="52"
        :circle_y="52"
        :radius="48"
        :strk="hover_color[well_index]"
        :plate_fill="platecolor[well_index]"
        :stroke_wdth="stroke_width[well_index]"
        :index="well_index"
        @enter-well="on_wellenter(well_index)"
        @leave-well="on_wellleave(well_index)"
        @click-exact="basic_select(well_index)"
        @click-shift-exact="basic_shift_or_ctrl_select(well_index)"
      ></PlateWell>
    </span>
  </div>
</template>
<script>
import { mapState } from "vuex";
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
  name: "PlateHeatMap",
  components: { FontAwesomeIcon, PlateWell },
  props: {
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
      hover: new Array(24).fill(false),
      hover_color: new Array(24).fill(hover_color),
      stroke_width: new Array(24).fill(no_stroke_width),
      row_values: ["A", "B", "C", "D"],
      column_values: ["1", "2", "3", "4", "5", "6"],
      column_wells: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [16, 17, 18, 19],
        [20, 21, 22, 23],
      ],
      row_wells: [
        [0, 4, 8, 12, 16, 20],
        [1, 5, 9, 13, 17, 21],
        [2, 6, 10, 14, 18, 22],
        [3, 7, 11, 15, 19, 23],
      ],
    };
  },
  computed: {
    ...mapState("heatmap", ["well_selection_statuses"]),
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    for (let j = 0; j < this.well_selection_statuses.length; j++) {
      this.stroke_width[j] = !this.well_selection_statuses[j] ? no_stroke_width : selected_stroke_width;
    }
    const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
    this.all_select_or_cancel = allEqual(this.well_selection_statuses) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
  },
  methods: {
    column_left_offset(column) {
      switch (column) {
        case "1":
          return "61.5";
        case "2":
          return "168.12";
        case "3":
          return "274.264";
        case "4":
          return "380.401";
        case "5":
          return "486.54";
        case "6":
          return "592.68";
      }
    },
    row_top_offset(row) {
      switch (row) {
        case "A":
          return "77.65";
        case "B":
          return "184.511";
        case "C":
          return "292.117";
        case "D":
          return "393.56";
      }
    },
    well_top_left_offset(index) {
      switch (index) {
        case 0:
          return "top: 44.436px; left: 55.948px;";
        case 1:
          return "top: 151.235px; left: 55.948px;";
        case 2:
          return "top: 255.035px; left: 55.948px;";
        case 3:
          return "top: 358.755px; left: 55.948px;";
        case 4:
          return "top: 44.436px; left: 162.126px;";
        case 5:
          return "top: 151.235px; left: 162.126px;";
        case 6:
          return "top: 255.035px; left: 162.126px;";
        case 7:
          return "top: 358.755px; left: 162.126px;";
        case 8:
          return "top: 44.436px; left: 268.264px;";
        case 9:
          return "top: 151.235px; left: 268.264px;";
        case 10:
          return "top: 255.035px; left: 268.264px;";
        case 11:
          return "top: 358.755px; left: 268.264px;";
        case 12:
          return "top: 44.436px; left: 374.401px;";
        case 13:
          return "top: 151.235px; left: 374.401px;";
        case 14:
          return "top: 255.035px; left: 374.401px;";
        case 15:
          return "top: 358.755px; left: 374.401px;";
        case 16:
          return "top: 44.436px; left: 480.54px;"; // 187 // 574.5
        case 17:
          return "top: 151.235px; left: 480.54px;";
        case 18:
          return "top: 255.035px; left: 480.54px;";
        case 19:
          return "top: 358.755px; left: 480.54px;";
        case 20:
          return "top: 44.436px; left: 587.68px;";
        case 21:
          return "top: 151.235px; left: 587.68px;";
        case 22:
          return "top: 255.035px; left: 587.68px;";
        case 23:
          return "top: 358.755px; left: 587.68px;";
      }
    },
    on_select_cancel_all(state) {
      if (this.all_select_or_cancel == true) {
        this.test_event("+ icon clicked");
      } else {
        this.test_event("- icon clicked");
      }
      this.all_select_or_cancel = !state;
      this.on_plate_well_selected(new Array(24).fill(state));
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.well_selection_statuses.length; j++) {
        this.stroke_width[j] = !this.well_selection_statuses[j] ? no_stroke_width : selected_stroke_width;
        this.hover_color[j] = !this.well_selection_statuses[j] ? hover_color : selected_color;
      }
    },
    on_plus_minus_enter_hover(state) {
      if (state == true) {
        this.test_event("+ icon enter => Hover");
      } else {
        this.test_event("- icon enter => Hover");
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.well_selection_statuses.length; j++) {
        this.stroke_width[j] = !this.well_selection_statuses[j] ? hover_stroke_width : selected_stroke_width;
      }
    },
    on_plus_minus_leave_hover(state) {
      if (state == true) {
        this.test_event("+ icon leave => Hover");
      } else {
        this.test_event("- icon leave => Hover");
      }
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.well_selection_statuses.length; j++) {
        this.stroke_width[j] = !this.well_selection_statuses[j] ? no_stroke_width : selected_stroke_width;
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
      this.on_plate_well_selected(new_list);
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.on_wellenter(value);
    },
    basic_shift_or_ctrl_select(value) {
      this.test_event("Well Shift or Ctrl clicked");
      const allEqual = (arr) => arr.every((v) => v === true);
      const new_list = [...this.well_selection_statuses];
      new_list[value] = !this.well_selection_statuses[value];
      this.on_plate_well_selected(new_list);
      this.stroke_width[value] = selected_stroke_width;
      if (allEqual(this.well_selection_statuses)) {
        this.all_select_or_cancel = false;
      } else {
        this.all_select_or_cancel = true;
      }
      this.on_wellenter(value);
    },
    on_wellenter(value) {
      this.hover[value] = true;
      this.hover_color[value] = hover_color;
      this.stroke_width.splice(0, this.stroke_width.length);
      this.test_event("well enter =>" + value + " Hover");
      for (let j = 0; j < this.well_selection_statuses.length; j++) {
        this.stroke_width[j] = !this.well_selection_statuses[j] ? no_stroke_width : selected_stroke_width;
      }
      if (this.well_selection_statuses[value] == true) {
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
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
      }
    },
    on_row_select(row) {
      const new_list = new Array(24).fill(false);
      this.test_event(row + " clicked");
      this.stroke_width.splice(0, this.stroke_width.length);
      this.row_wells[row].map((well) => (new_list[well] = true));
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.on_plate_well_selected(new_list);
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_column_select(column) {
      const new_list = new Array(24).fill(false);
      this.test_event(column + " clicked");
      this.stroke_width.splice(0, this.stroke_width.length);
      this.column_wells[column].map((well) => (new_list[well] = true));
      if (this.all_select_or_cancel == false) {
        this.all_select_or_cancel = true;
      }
      this.on_plate_well_selected(new_list);
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_row_ctrl_click_or_shift_click(row) {
      let result = false;
      this.test_event(row + " ctrl or shift clicked");
      const new_list = [...this.well_selection_statuses];
      this.stroke_width.splice(0, this.stroke_width.length);
      result =
        new_list[this.row_wells[row][0]] &&
        new_list[this.row_wells[row][1]] &&
        new_list[this.row_wells[row][2]] &&
        new_list[this.row_wells[row][3]];
      this.row_wells[row].map((well) => {
        new_list[well] = !result;
      });
      this.on_plate_well_selected(new_list);
      const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
      this.all_select_or_cancel = allEqual(this.well_selection_statuses) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_column_ctrl_click_or_shift_click(column) {
      this.test_event(column + " ctrl or shift clicked");
      let result = false;
      const new_list = [...this.well_selection_statuses];
      this.stroke_width.splice(0, this.stroke_width.length);
      result =
        new_list[this.column_wells[column][0]] &&
        new_list[this.column_wells[column][1]] &&
        new_list[this.column_wells[column][2]] &&
        new_list[this.column_wells[column][3]];
      this.column_wells[column].map((well) => {
        new_list[well] = !result;
      });
      this.on_plate_well_selected(new_list);
      const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
      this.all_select_or_cancel = allEqual(this.well_selection_statuses) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_column_enter_hover(column) {
      this.test_event(column + " hover enter");
      const new_list = [];
      for (let i = 0; i < this.stroke_width.length; i++) new_list[i] = this.stroke_width[i];
      this.stroke_width.splice(0, this.stroke_width.length);
      this.column_wells[column].map(
        (well) => (new_list[well] = new_list[well] == no_stroke_width ? hover_stroke_width : new_list[well])
      );
      for (let j = 0; j < new_list.length; j++) this.stroke_width[j] = new_list[j];
    },
    on_column_leave_hover(column) {
      this.test_event(column + " hover leave");
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_row_enter_hover(row) {
      this.test_event(row + " hover enter");
      const new_list = [];
      for (let i = 0; i < this.stroke_width.length; i++) new_list[i] = this.stroke_width[i];
      this.stroke_width.splice(0, this.stroke_width.length);
      this.row_wells[row].map(
        (well) => (new_list[well] = new_list[well] == no_stroke_width ? hover_stroke_width : new_list[well])
      );
      for (let j = 0; j < new_list.length; j++) this.stroke_width[j] = new_list[j];
    },
    on_row_leave_hover(row) {
      this.test_event(row + " hover leave");
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let i = 0; i < this.well_selection_statuses.length; i++) {
        this.stroke_width[i] = !this.well_selection_statuses[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.well_selection_statuses[i] ? hover_color : selected_color;
      }
    },
    on_plate_well_selected(new_selection_statuses) {
      this.$store.commit("heatmap/set_well_selection_statuses", new_selection_statuses);
      const selected_wells = [];
      for (let i = 0; i < new_selection_statuses.length; i++) {
        if (new_selection_statuses[i] == true) {
          selected_wells.push(i);
        }
      }
      this.$store.commit("heatmap/set_selected_wells", selected_wells);
      // this.$emit("platewell-selected", this.well_selection_statuses);
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
body {
  user-select: none;
}
.div__heatmap-editor-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 715px;
  height: 480px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
}
.div__heatmap-drag-drop-selector {
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
.span__heatmap-editor-column-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 90px;
  height: 39px;
  top: 7px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 24px;
  color: rgb(183, 183, 183);
  text-align: center;
}
.span__heatmap-editor-column-index label:hover,
.span__heatmap-editor-row-index label:hover {
  color: #ececed;
}
.span__heatmap-toggle-plus-minus-icon:hover {
  color: #ffffff;
}
.span__heatmap-editor-row-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 37px;
  height: 35px;
  left: 12px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 24px;
  color: rgb(183, 183, 183);
  text-align: left;
}
.span__heatmap-toggle-plus-minus-icon {
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  top: 12px;
  left: 12px;
  font-size: 30px;
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
