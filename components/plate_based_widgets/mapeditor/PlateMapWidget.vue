<template>
  <div class="div__platemap-editor-backdrop">
    <span
      v-for="column_index in 6"
      :key="'column_' + column_index"
      :style="column_computed_offsets[column_index - 1]"
      class="span__platemap-editor-column-index"
    >
      <label
        :id="'column_' + column_index"
        @click.exact="on_select(column_index, column_values)"
        @click.shift.exact="on_shift_click(column_index, column_values)"
        @mouseenter="on_enter_hover(column_index, column_values)"
        @mouseleave="on_leave_hover(column_index, column_values)"
        >0{{ column_index }}</label
      >
    </span>
    <span
      v-for="(v, i) in Object.keys(row_values)"
      :key="'row_' + v"
      :style="row_computed_offsets[i]"
      class="span__platemap-editor-row-index"
    >
      <label
        :id="'row_' + i"
        @click.exact="on_select(v, row_values)"
        @click.shift.exact="on_shift_click(v, row_values)"
        @mouseenter="on_enter_hover(v, row_values)"
        @mouseleave="on_leave_hover(v, row_values)"
      >
        {{ v }}</label
      >
    </span>
    <span
      class="span__platemap-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
      @mouseenter="on_plus_minus_enter_hover(all_select_or_cancel)"
      @mouseleave="on_plus_minus_leave_hover(all_select_or_cancel)"
    >
      <FontAwesomeIcon v-show="all_select_or_cancel" id="plus" :icon="['fa', 'plus-circle']" />
      <FontAwesomeIcon v-show="!all_select_or_cancel" id="minus" :icon="['fa', 'minus-circle']" />
    </span>
    <div
      v-for="well_index in Array(number_of_wells).keys()"
      :key="well_index"
      :class="'well_' + well_index"
      :style="well_computed_style[well_index]"
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
        @click-shift-exact="basic_shift_select(well_index)"
      />
    </div>
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

export default {
  name: "PlateMap",
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
    number_of_wells: { type: Number, default: 24 },
  },
  data() {
    return {
      row_values: {
        A: [0, 4, 8, 12, 16, 20],
        B: [1, 5, 9, 13, 17, 21],
        C: [2, 6, 10, 14, 18, 22],
        D: [3, 7, 11, 15, 19, 23],
      },
      column_values: {
        1: [0, 1, 2, 3],
        2: [4, 5, 6, 7],
        3: [8, 9, 10, 11],
        4: [12, 13, 14, 15],
        5: [16, 17, 18, 19],
        6: [20, 21, 22, 23],
      },
      all_select_or_cancel: false,
      hover: new Array(this.number_of_wells).fill(false),
      all_select: new Array(this.number_of_wells).fill(false),
      hover_color: new Array(this.number_of_wells).fill(hover_color),
      stroke_width: new Array(this.number_of_wells).fill(no_stroke_width),
    };
  },
  computed: {
    well_computed_style: function () {
      return [...Array(24).keys()].map((i) => {
        const computed_top = 26 + (i % 4) * 60;
        const computed_left = 33 + Math.floor(i / 4) * 62;
        return "position: absolute; top:" + computed_top + "px;" + "left:" + computed_left + "px;";
      });
    },
    all_equal: function () {
      return this.all_select.every((v) => v);
    },
    row_computed_offsets: function () {
      return ["41", "103", "165", "224"].map((v) => "top:" + v + "px;");
    },
    column_computed_offsets: function () {
      return ["39", "101", "164", "225", "287", "349"].map((v) => "left:" + v + "px;");
    },
  },
  watch: {
    selected: function () {
      // reset stroke width when selected wells is reset
      if (this.selected.filter((x) => x).length === 0) {
        this.all_select = Array(this.number_of_wells).fill(false);
        this.stroke_width = Array(this.number_of_wells).fill(no_stroke_width);
      }
    },
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    this.check_stroke_width();
    this.all_select_or_cancel = !this.all_equal; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
  },
  methods: {
    basic_select(value) {
      this.all_select = new Array(this.number_of_wells).fill(false);
      this.all_select[value] = true;
      this.stroke_width[value] = selected_stroke_width;
      if (!this.all_select_or_cancel) this.all_select_or_cancel = true;
      this.on_plate_well_selected();
      this.on_wellenter(value);
    },
    on_select_cancel_all(state) {
      this.all_select_or_cancel = !state;
      this.all_select = new Array(this.number_of_wells).fill(state);
      this.on_plate_well_selected();
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },
    on_plus_minus_enter_hover() {
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j] ? hover_stroke_width : selected_stroke_width;
      }
    },
    on_plus_minus_leave_hover() {
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },
    on_wellenter(value) {
      this.hover[value] = true;
      this.hover_color[value] = "#ececed";
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
      this.stroke_width[value] = this.all_select[value] ? selected_stroke_width : hover_stroke_width;
    },

    on_wellleave(value) {
      this.hover[value] = false;
      this.hover_color[value] = selected_color;
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },
    on_select(val, values_to_change) {
      this.all_select = new Array(this.number_of_wells).fill(false);
      this.stroke_width.splice(0, this.stroke_width.length);
      values_to_change[val].map((well) => (this.all_select[well] = true));
      if (!this.all_select_or_cancel) this.all_select_or_cancel = true;

      this.check_stroke_width();
      this.on_plate_well_selected();
    },
    basic_shift_select(value) {
      this.all_select[value] = !this.all_select[value];
      this.stroke_width[value] = selected_stroke_width;
      this.all_select_or_cancel = !this.all_select.every((v) => v);
      this.on_plate_well_selected();
      this.on_wellenter(value);
    },

    on_enter_hover(val, values_to_change) {
      const new_list = JSON.parse(JSON.stringify(this.stroke_width));
      this.stroke_width.splice(0, this.stroke_width.length);
      values_to_change[val].map(
        (well) => (new_list[well] = new_list[well] == no_stroke_width ? hover_stroke_width : new_list[well])
      );
      this.stroke_width = new_list;
    },
    on_leave_hover() {
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },
    on_plate_well_selected() {
      this.$emit("platewell-selected", this.all_select);
    },
    on_shift_click(val, values_to_change) {
      const new_list = JSON.parse(JSON.stringify(this.all_select));
      this.stroke_width.splice(0, this.stroke_width.length);
      const selected_item = values_to_change[val];
      const result = selected_item.map((i) => new_list[i]).every((x) => x);

      selected_item.map((well) => {
        new_list[well] = !result;
      });
      this.all_select = new_list;
      this.all_select_or_cancel = !this.all_equal;
      this.check_stroke_width();
      this.on_plate_well_selected();
    },
    check_stroke_width() {
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i] ? hover_color : selected_color;
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
.span__platemap-editor-row-index label:hover {
  color: #ececed;
}

.span__platemap-toggle-plus-minus-icon:hover {
  color: #ffffff;
}

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
