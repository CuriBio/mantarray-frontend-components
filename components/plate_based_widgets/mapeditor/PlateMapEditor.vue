<template>
  <div>
    <div class="div__platemap-editor-backdrop"></div>
    <span class="span__platemap-editor-column-index-one">
      <label
        @click.exact="on_column_select('1')"
        @click.shift.exact="on_ctrl_click_or_shift_click('1')"
        >01</label
      >
    </span>
    <span class="span__platemap-editor-column-index-two">
      <label
        @click.exact="on_column_select('2')"
        @click.shift.exact="on_ctrl_click_or_shift_click('2')"
      >
        02</label
      >
    </span>
    <span class="span__platemap-editor-column-index-three">
      <label
        @click.exact="on_column_select('3')"
        @click.shift.exact="on_ctrl_click_or_shift_click('3')"
      >
        03</label
      >
    </span>
    <span class="span__platemap-editor-column-index-four">
      <label
        @click.exact="on_column_select('4')"
        @click.shift.exact="on_ctrl_click_or_shift_click('4')"
      >
        04</label
      >
    </span>
    <span class="span__platemap-editor-column-index-five">
      <label
        @click.exact="on_column_select('5')"
        @click.shift.exact="on_ctrl_click_or_shift_click('5')"
        >05</label
      >
    </span>
    <span class="span__platemap-editor-column-index-six">
      <label
        @click.exact="on_column_select('6')"
        @click.shift.exact="on_ctrl_click_or_shift_click('6')"
      >
        06</label
      >
    </span>
    <span class="span__platemap-editor-row-index-A">
      <label
        @click.exact="on_row_select('A')"
        @click.shift.exact="on_row_ctrl_click_or_shift_click('A')"
      >
        A</label
      >
    </span>
    <span class="span__platemap-editor-row-index-B">
      <label
        @click.exact="on_row_select('B')"
        @click.shift.exact="on_row_ctrl_click_or_shift_click('B')"
      >
        B</label
      >
    </span>
    <span class="span__platemap-editor-row-index-C">
      <label
        @click.exact="on_row_select('C')"
        @click.shift.exact="on_row_ctrl_click_or_shift_click('C')"
      >
        C</label
      >
    </span>
    <span class="span__platemap-editor-row-index-D">
      <label
        @click.exact="on_row_select('D')"
        @click.shift.exact="on_row_ctrl_click_or_shift_click('D')"
      >
        D</label
      >
    </span>
    <span
      class="span__platemap-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
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
        this.stroke_width[j] = !this.all_select[j] ? 0 : 4;
      }
      this.on_plate_well_selected();
    },
    basic_select(value) {
      const new_list = new Array(24).fill(false);

      new_list[value] = true;
      this.test_event("Well clicked");
      this.stroke_width[value] = 4;
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
      const allEqual = (arr) => arr.every((v) => v === arr[0]);
      this.all_select[value] = !this.all_select[value];
      this.stroke_width[value] = 4;
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
      this.hover_color[value] = "#ececed";
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
        this.stroke_width[i] = !this.all_select[i] ? 0 : 4;
        this.hover_color[i] = !this.all_select[i] ? "#ececed" : "#FFFFFF";
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
        this.stroke_width[i] = !this.all_select[i] ? 0 : 4;
        this.hover_color[i] = !this.all_select[i] ? "#ececed" : "#FFFFFF";
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
        this.stroke_width[i] = !this.all_select[i] ? 0 : 4;
        this.hover_color[i] = !this.all_select[i] ? "#ececed" : "#FFFFFF";
      }
      this.on_plate_well_selected();
    },
    on_ctrl_click_or_shift_click(column) {
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
        this.stroke_width[i] = !this.all_select[i] ? 0 : 4;
        this.hover_color[i] = !this.all_select[i] ? "#ececed" : "#FFFFFF";
      }
      this.on_plate_well_selected();
    },
    on_plate_well_selected() {
      this.$emit("platewell-selected", this.all_select);
    },
    test_event(evnt) {
      this.$emit("test-event", evnt);
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

.span__platemap-editor-column-index-one label:hover,
.span__platemap-editor-column-index-two label:hover,
.span__platemap-editor-column-index-three label:hover,
.span__platemap-editor-column-index-four label:hover,
.span__platemap-editor-column-index-five label:hover,
.span__platemap-editor-column-index-six label:hover,
.span__platemap-editor-row-index-A label:hover,
.span__platemap-editor-row-index-B label:hover,
.span__platemap-editor-row-index-C label:hover,
.span__platemap-editor-row-index-D label:hover {
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
  border-radius: 50%;
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
