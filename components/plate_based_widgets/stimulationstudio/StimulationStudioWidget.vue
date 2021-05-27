<template>
  <div>
    <div class="div__simulationstudio-backdrop"></div>
    <span
      v-for="column_index in 6"
      :key="'column_' + column_index"
      :style="'left:' + column_left_offset(column_index) + 'px;'"
      class="span__stimulationstudio-column-index"
    >
      <label
        :id="'column_' + column_index"
        @click.exact="on_select(column_index, 'column')"
        @mouseenter="on_enter_hover(column_index, 'column')"
        @mouseleave="on_leave_hover(column_index, 'column')"
        >0{{ column_index }}</label
      >
    </span>
    <span
      v-for="(value, key) in row_values"
      :key="'row_' + key"
      :style="'top:' + row_top_offset(key) + 'px;'"
      class="span__stimulationstudio-row-index"
    >
      <label
        :id="'row_' + key"
        @click.exact="on_select(key, 'row')"
        @mouseenter="on_enter_hover(key, 'row')"
        @mouseleave="on_leave_hover(key, 'row')"
      >
        {{ key }}</label
      >
    </span>
    <span
      class="span__stimulationstudio-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
      @mouseenter="on_plus_minus_enter_hover(all_select_or_cancel)"
      @mouseleave="on_plus_minus_leave_hover(all_select_or_cancel)"
    >
      <FontAwesomeIcon v-show="all_select_or_cancel" id="plus" :icon="['fa', 'plus-circle']" />
      <FontAwesomeIcon v-show="!all_select_or_cancel" id="minus" :icon="['fa', 'minus-circle']" />
    </span>
    <div v-for="well_index in Array(24).keys()" :key="well_index">
      <StimulationStudioPlateWell
        :protocol_type="getProtocolAlphabet(protocol_codes[well_index])"
        :stroke="hover_color[well_index]"
        :stroke_wdth="stroke_width[well_index]"
        :protocol_fill="getProtocolColor(protocol_codes[well_index])"
        :index="well_index"
        @enter-well="on_wellenter(well_index)"
        @leave-well="on_wellleave(well_index)"
        @click-exact="basic_select(well_index)"
      ></StimulationStudioPlateWell>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StimulationStudioPlateWell from "@/components/basic_widgets/StimulationStudioPlateWell.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faMinusCircle);
library.add(faPlusCircle);

const debug_mode = undefined;

export default {
  name: "StimulationStudioWidget",
  components: { FontAwesomeIcon, StimulationStudioPlateWell },
  props: {
    protocol_codes: {
      type: Array,
      default() {
        return [];
      }
    },
    selected: {
      type: Array,
      default: function() {
        return new Array(24).fill(false);
      }
    }
  },
  data() {
    return {
      row_values: {
        A: [0, 4, 8, 12, 16, 20],
        B: [1, 5, 9, 13, 17, 21],
        C: [2, 6, 10, 14, 18, 22],
        D: [3, 7, 11, 15, 19, 23]
      },
      column_values: {
        1: [0, 1, 2, 3],
        2: [4, 5, 6, 7],
        3: [8, 9, 10, 11],
        4: [12, 13, 14, 15],
        5: [16, 17, 18, 19],
        6: [20, 21, 22, 23]
      },
      all_select: this.selected,
      all_select_or_cancel: false,
      hover: new Array(24).fill(false),
      hover_color: new Array(24).fill("#ececed"),
      stroke_width: new Array(24).fill(0),
      no_stroke_width: 0,
      check_selected_status: [],
      hover_stroke_width: 2,
      selected_stroke_width: 4,
      selected_color: "#FFFFFF"
    };
  },
  computed: {
    ...mapState("stimulation", ["selected_wells"])
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    this.check_stroke_width();
    const allEqual = arr => arr.every(v => v === true); // verify in the pre-select all via a const allEqual function.
    this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
  },
  methods: {
    getProtocolColor(index) {
      if (index >= 0 && index <= 25) {
        return "#19AC8A";
      }
      if (index >= 26 && index <= 51) {
        return "#005470";
      }
      if (index >= 52 && index <= 77) {
        return "#f9d78c";
      }
      if (index >= 78 && index <= 95) {
        return "#df6147";
      }
      return "#B7B7B7";
    },

    getProtocolAlphabet(value) {
      if (value >= 0 && value <= 25) {
        return this.alphabet[value];
      }
      if (value >= 26 && value <= 51) {
        return this.alphabet[value - 26];
      }
      if (value >= 52 && value <= 77) {
        return this.alphabet[value - 52];
      }
      if (value >= 78 && value <= 95) {
        return this.alphabet[value - 78];
      }
      return "";
    },

    on_select_cancel_all(state) {
      this.all_select_or_cancel ? this.test_event("+ icon clicked") : this.test_event("- icon clicked");
      this.all_select_or_cancel = !state;
      for (let count = 0; count < 24; count++) this.all_select[count] = state;
      state ? this.all_select.map(well => (well = true)) : this.all_select.map(well => (well = false));
      this.$store.commit("stimulation/handle_selected_wells", this.all_select);
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },

    on_plus_minus_enter_hover(state) {
      state ? this.test_event("+ icon leave => Hover") : this.test_event("- icon leave => Hover");
      this.stroke_width.splice(0, this.stroke_width.length);
      for (let j = 0; j < this.all_select.length; j++) {
        this.stroke_width[j] = !this.all_select[j] ? this.hover_stroke_width : this.selected_stroke_width;
      }
    },

    on_plus_minus_leave_hover(state) {
      state ? this.test_event("+ icon leave => Hover") : this.test_event("- icon leave => Hover");
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },

    basic_select(value) {
      this.test_event("Well clicked");
      this.stroke_width[value] = this.selected_stroke_width;
      this.all_select[value] ? (this.all_select[value] = false) : (this.all_select[value] = true);
      if (!this.all_select_or_cancel) this.all_select_or_cancel = true;
      this.$store.commit("stimulation/handle_selected_wells", this.all_select);
      this.on_wellenter(value);
    },

    on_wellenter(value) {
      this.hover[value] = true;
      this.hover_color[value] = "#ececed";
      this.stroke_width.splice(0, this.stroke_width.length);
      this.test_event("well enter =>" + value + " Hover");
      this.check_stroke_width();
      this.all_select[value]
        ? (this.stroke_width[value] = this.selected_stroke_width)
        : (this.stroke_width[value] = this.hover_stroke_width);
    },

    on_wellleave(value) {
      this.hover[value] = false;
      this.hover_color[value] = this.selected_color;
      this.stroke_width.splice(0, this.stroke_width.length);
      this.test_event("well leave =>" + value + " Hover");
      this.check_stroke_width();
    },

    on_select(val, type) {
      let toChange = null;
      type == "column" ? (toChange = this.column_values) : (toChange = this.row_values);
      if (this.check_selected_status.includes(val)) {
        this.check_selected_status.splice(this.check_selected_status.indexOf(val), 1);
        toChange[val].map(well => {
          this.all_select[well] = false;
        });
      } else {
        this.check_selected_status.push(val);
        toChange[val].map(well => {
          this.all_select[well] = true;
        });
      }
      if (!this.all_select_or_cancel) this.all_select_or_cancel = true;
      this.$store.commit("stimulation/handle_selected_wells", this.all_select);
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
      this.test_event(val + " clicked");
    },

    on_enter_hover(val, type) {
      this.test_event(val + " hover enter");
      const new_list = [];
      for (let i = 0; i < this.stroke_width.length; i++) new_list[i] = this.stroke_width[i];
      for (let j = 0; j < new_list.length; j++) this.stroke_width[j] = new_list[j];
      this.stroke_width.splice(0, this.stroke_width.length);
      let toChange = null;
      type == "column" ? (toChange = this.column_values) : (toChange = this.row_values);
      toChange[val].map(
        well =>
          (new_list[well] = new_list[well] == this.no_stroke_width ? this.hover_stroke_width : new_list[well])
      );
      for (let j = 0; j < new_list.length; j++) this.stroke_width[j] = new_list[j];
    },

    on_leave_hover(val) {
      this.test_event(val + " hover leave");
      this.stroke_width.splice(0, this.stroke_width.length);
      this.check_stroke_width();
    },

    test_event(evnt) {
      if (debug_mode != undefined) this.$emit("test-event", evnt);
    },
    check_stroke_width() {
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i] ? this.no_stroke_width : this.selected_stroke_width;
        this.hover_color[i] = !this.all_select[i] ? "#ececed" : this.selected_color;
      }
    },

    column_left_offset(column) {
      switch (column) {
        case 1:
          return "35.9792";
        case 2:
          return "97.5836";
        case 3:
          return "159.188";
        case 4:
          return "220.792";
        case 5:
          return "282.397";
        case 6:
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
    }
  }
};
</script>
<style>
.div__simulationstudio-backdrop {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 415px;
  height: 280px;
  visibility: visible;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
}
.span__simulationstudio-plus-icon {
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
.span__stimulationstudio-row-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  left: 8px;
  margin-top: 2px;
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
.span__stimulationstudio-column-index {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: 3px;
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
.span__stimulationstudio-column-index label:hover,
.span__stimulationstudio-row-index label:hover {
  color: #ececed;
}
.span__stimulationstudio-toggle-plus-minus-icon {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  top: 9px;
  left: 9px;
  font-size: 20px;
  color: rgb(183, 183, 183);
}
.span__stimulationstudio-toggle-plus-minus-icon:hover {
  color: #ffffff;
}
</style>
