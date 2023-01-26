<template>
  <div class="div__simulationstudio-backdrop">
    <span
      v-for="column_index in 6"
      :key="'column_' + column_index"
      :style="column_computed_offsets[column_index - 1]"
      class="span__stimulationstudio-column-index"
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
      class="span__stimulationstudio-row-index"
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
      class="span__stimulationstudio-toggle-plus-minus-icon"
      @click.exact="on_select_cancel_all(all_select_or_cancel)"
      @mouseenter="on_plus_minus_enter_hover(all_select_or_cancel)"
      @mouseleave="on_plus_minus_leave_hover(all_select_or_cancel)"
    >
      <FontAwesomeIcon v-show="all_select_or_cancel" id="plus" :icon="['fa', 'plus-circle']" />
      <FontAwesomeIcon v-show="!all_select_or_cancel" id="minus" :icon="['fa', 'minus-circle']" />
    </span>
    <div v-for="well_index in Array(number_of_wells).keys()" :key="well_index">
      <StimulationStudioPlateWell
        :id="'plate_' + well_index"
        :class="hover_color[well_index]"
        :protocol_type="get_protocol_letter(well_index)"
        :stroke="hover_color[well_index]"
        :stroke_wdth="stroke_width[well_index]"
        :protocol_fill="get_protocol_color(well_index)"
        :index="well_index"
        :disable="assigned_open_circuits.includes(well_index)"
        :display="disable"
        @enter-well="on_wellenter(well_index)"
        @leave-well="on_wellleave(well_index)"
        @click-exact="basic_select(well_index)"
        @click-shift-exact="basic_shift_select(well_index)"
      />
    </div>
    <div v-if="disable" class="div__simulationstudio-disable-overlay" :style="'opacity: 0;'" />
    <div
      v-if="short_circuit_error_found"
      v-b-popover.hover.bottom="'Stimulation lid must be replaced before running a stimulation'"
      title="Error"
      class="div__simulationstudio-disable-overlay"
      :style="'opacity: 0.7;'"
    >
      <div class="div__disabled-overlay-text">Disabled</div>
    </div>
  </div>
</template>

<script>
import StimulationStudioPlateWell from "@/components/basic_widgets/StimulationStudioPlateWell.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import Vue from "vue";
import { VBPopover } from "bootstrap-vue";

Vue.directive("b-popover", VBPopover);
library.add(faMinusCircle);
library.add(faPlusCircle);

const no_stroke_width = 0;
const hover_stroke_width = 2;
const selected_stroke_width = 4;
const hover_color = "#ececed";
const selected_color = "#FFFFFF";

export default {
  name: "StimulationStudioWidget",
  components: { FontAwesomeIcon, StimulationStudioPlateWell },
  props: {
    number_of_wells: { type: Number, default: 24 },
    disable: { type: Boolean, default: false },
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
    ...mapState("stimulation", ["protocol_assignments", "stim_status"]),
    ...mapState("data", ["stimulator_circuit_statuses"]),
    short_circuit_error_found: function () {
      return this.stim_status === STIM_STATUS.SHORT_CIRCUIT_ERROR;
    },
    assigned_open_circuits: function () {
      // filter for matching indices
      return this.stimulator_circuit_statuses.filter((well) =>
        Object.keys(this.protocol_assignments).includes(well.toString())
      );
    },
    row_computed_offsets: function () {
      return ["41", "103", "165", "224"].map((v) => "top:" + v + "px;");
    },
    column_computed_offsets: function () {
      return ["39", "101", "164", "225", "287", "349"].map((v) => "left:" + v + "px;");
    },
  },
  watch: {
    all_select: function () {
      this.$store.dispatch("stimulation/handle_selected_wells", this.all_select);
    },
  },
  created() {
    this.stroke_width.splice(0, this.stroke_width.length);
    this.check_stroke_width();
    const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
    this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (
        mutation.type === "stimulation/apply_selected_protocol" ||
        mutation.type === "stimulation/clear_selected_protocol" ||
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        // this.protocol_assignments = this.stored_protocol_assignments;
        this.all_select = new Array(this.number_of_wells).fill(false);
        this.stroke_width = new Array(this.number_of_wells).fill(no_stroke_width);
        if (!this.all_select_or_cancel) this.all_select_or_cancel = true;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    on_select_cancel_all(state) {
      this.all_select_or_cancel = !state;
      this.all_select = new Array(this.number_of_wells).fill(state);
      this.$store.dispatch("stimulation/handle_selected_wells", this.all_select);
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

    basic_select(value) {
      this.all_select = new Array(this.number_of_wells).fill(false);
      this.all_select[value] = true;
      this.stroke_width[value] = selected_stroke_width;
      if (!this.all_select_or_cancel) this.all_select_or_cancel = true;
      this.on_wellenter(value);
    },

    basic_shift_select(value) {
      const allEqual = (arr) => arr.every((v) => v === true);
      this.all_select[value] = !this.all_select[value];
      this.stroke_width[value] = selected_stroke_width;
      if (allEqual(this.all_select)) this.all_select_or_cancel = false;
      else this.all_select_or_cancel = true;
      this.$store.dispatch("stimulation/handle_selected_wells", this.all_select);
      this.on_wellenter(value);
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

    on_shift_click(val, values_to_change) {
      const new_list = JSON.parse(JSON.stringify(this.all_select));
      this.stroke_width.splice(0, this.stroke_width.length);
      const result = values_to_change[val].map((i) => new_list[i]).every((x) => x);
      values_to_change[val].map((well) => {
        new_list[well] = !result;
      });

      this.all_select = new_list;
      const allEqual = (arr) => arr.every((v) => v === true); // verify in the pre-select all via a const allEqual function.
      this.all_select_or_cancel = allEqual(this.all_select) ? false : true; // if pre-select has all wells is true, then toggle from (+) to (-) icon.
      this.check_stroke_width();
    },
    check_stroke_width() {
      for (let i = 0; i < this.all_select.length; i++) {
        this.stroke_width[i] = !this.all_select[i] ? no_stroke_width : selected_stroke_width;
        this.hover_color[i] = !this.all_select[i] ? hover_color : selected_color;
      }
    },
    get_protocol_color(index) {
      return this.protocol_assignments[index] ? this.protocol_assignments[index].color : "#B7B7B7";
    },

    get_protocol_letter(index) {
      return this.protocol_assignments[index] ? this.protocol_assignments[index].letter : "";
    },
  },
};
</script>
<style scoped>
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
  z-index: 2;
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
  cursor: pointer;
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
  cursor: pointer;
}
.div__simulationstudio-disable-overlay {
  height: 280px;
  width: 415px;
  z-index: 3;
  border-radius: 10px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div__disabled-overlay-text {
  color: #b7b7b7;
  font-family: Muli;
  font-size: 70px;
  font-style: italic;
  opacity: 0.5;
  font-weight: 500;
}
</style>
