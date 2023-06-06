<template>
  <div>
    <div :class="is_modal_open ? 'div__modal-overlay' : null">
      <div>
        <div class="div__drag-and-drop-panel">
          <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
          <canvas class="canvas__stimulationstudio-header-separator" />
          <div
            v-if="disable_edits"
            v-b-popover.hover.bottom="sidebar_block_label"
            class="div__sidebar-block"
          />
          <draggable
            v-model="icon_types"
            tag="div"
            class="draggable__tile-container"
            :disabled="disable_edits"
            :group="{ name: 'order', pull: 'clone', put: false }"
            :clone="clone"
            @start="is_dragging = true"
            @end="is_dragging = false"
          >
            <div v-for="(type, idx) in icon_types" :id="type" :key="idx">
              <img :src="require(`@/assets/img/${type}.png`)" />
            </div>
          </draggable>
        </div>
        <SmallDropDown
          class="dropdown-container"
          :input_height="25"
          :disable="disable_dropdown"
          :input_width="100"
          :options_text="time_units_array"
          :options_idx="time_units_idx"
          :dom_id_suffix="'time_units'"
          :style="disable_dropdown ? 'cursor: unset;' : null"
          @selection-changed="handle_time_unit"
        />

        <div class="div__scroll-container">
          <draggable
            v-model="protocol_order"
            class="dragArea"
            :disabled="disable_edits"
            :group="{ name: 'order' }"
            :ghost-class="'ghost'"
            @change="check_type($event)"
            @start="start_dragging"
            @end="is_dragging = false"
          >
            <div
              v-for="(pulse, idx) in protocol_order"
              :key="idx"
              :class="'div__repeat-container'"
              :style="get_border_style(pulse)"
            >
              <!-- Only display circular icon when nested loop, icon displays number of loops -->
              <div v-if="pulse.num_iterations" :class="'div__repeat-label-container'">
                <div class="div__circle" @dblclick="open_repeat_modal_for_edit(pulse.num_iterations, idx)">
                  <span :class="'span__repeat-label'">
                    {{ pulse.num_iterations }}
                  </span>
                </div>
              </div>
              <img
                v-if="pulse.type !== 'loop'"
                id="img__waveform-tile"
                :src="require(`@/assets/img/${pulse.type}.png`)"
                @dblclick="open_modal_for_edit(pulse.type, idx)"
                @mouseenter="on_pulse_enter(idx)"
                @mouseleave="on_pulse_leave"
              />
              <!-- Below is nested dropzone, can be disabled if needed -->
              <draggable
                v-model="pulse.subprotocols"
                class="dropzone"
                :group="{ name: 'order' }"
                :ghost-class="'ghost'"
                :style="pulse.type === 'loop' && 'margin-right: -31px'"
                :emptyInsertThreshold="60"
                :disabled="is_nesting_disabled"
                @change="handle_protocol_loop($event)"
                @start="is_dragging = true"
                @end="is_dragging = false"
              >
                <div
                  v-for="(nested_pulse, nested_idx) in pulse.subprotocols"
                  :id="`nested-pulse-${nested_idx}`"
                  :key="nested_idx"
                  :style="'position: relative;'"
                  @dblclick="open_modal_for_edit(nested_pulse.type, idx, nested_idx)"
                  @mouseenter="on_pulse_enter(idx, nested_idx)"
                  @mouseleave="on_pulse_leave"
                >
                  <img :src="require(`@/assets/img/${nested_pulse.type}.png`)" :style="'margin-top: 4px;'" />
                </div>
              </draggable>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div v-if="modal_type !== null" class="modal-container">
      <StimulationStudioWaveformSettingModal
        :pulse_type="modal_type"
        :modal_open_for_edit="modal_open_for_edit"
        :selected_pulse_settings="selected_pulse_settings"
        :current_color="selected_color"
        @close="on_modal_close"
      />
    </div>
    <div v-if="open_delay_modal" class="modal-container delay-container">
      <StimulationStudioInputModal
        :modal_open_for_edit="modal_open_for_edit"
        :current_unit="current_delay_unit"
        :current_input="current_input"
        :current_color="selected_color"
        @input-close="on_modal_close"
      />
    </div>
    <div v-if="open_repeat_modal" class="modal-container repeat-container">
      <StimulationStudioInputModal
        :modal_open_for_edit="modal_open_for_edit"
        :current_input="current_input"
        :input_label="'Number of Iterations:'"
        :include_units="false"
        :modal_title="'Setup Subprotocol Loop'"
        @input-close="close_repeat_modal"
      />
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapState, mapActions, mapMutations } from "vuex";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import StimulationStudioInputModal from "@/components/stimulation/StimulationStudioInputModal.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import { generate_random_color } from "@/js_utils/waveform_data_formatter";
import { DEFAULT_SUBPROTOCOL_TEMPLATES } from "@/js_utils/protocol_validation";
/**
 * @vue-data {Array} icon_type - The source for the draggable pulse tiles
 * @vue-data {Array} is_dragging - Boolean to determine if user is currently dragging a tile in the scrollable window
 * @vue-data {Array} time_units_array - Available units of time for drop down in settings panel
 * @vue-data {Object} selected_pulse_settings - This is the saved setting for a pulse that changes when a user opens a modal to edit a pulse
 * @vue-data {Array} protocol_order -  This is the complete order of pulses/delays/repeats in the entire new protocol
 * @vue-data {String} modal_type - Tracks which modal should open based on pulse type
 * @vue-data {String} setting_type - This is the stimulation type that user selects from drop down in settings panel
 * @vue-data {Int} dbl_click_pulse_idx - Index of selected pulse to edit in order to save new settings to correct pulse
 * @vue-data {String} open_delay_modal - Tracks which modal should open based on if it is a repeat or delay
 * @vue-data {String} current_delay_input - Saved input for a delay block that changes depending on which delay block is opened for edit
 * @vue-data {Boolean} cloned - Determines if a placed tile in protocol order is new and needs a modal to open appear to set settings or just an order rearrangement of existing tiles
 * @vue-data {Int} new_cloned_idx - If tile placed in protocol order is new, this index allows settings to be saved to correct index in order
 * @vue-data {Boolean} modal_open_for_edit - Determines if existing modal inputs should appear in modal for a reedit or if it's a new delay block with blank settings
 * @vue-data {Int} time_units_idx - Index for selected unit in dropdown, used to reset dropdown when editor is reset
 * @vue-data {Boolean} disable_dropdown - Determines if the dropdown is disabled or not dependent on the stop stim setting selected
 * @vue-event {Event} check_type - Checks if tile placed is new or existing and opens corresponding modal for settings or commits change in protocol order to state
 * @vue-event {Event} on_modal_close - Handles settings when modal is closed dependent on which button the user selects and which modal type is open, commits change to state
 * @vue-event {Event} open_modal_for_edit - Assigns selected pulse settings to modal for reedit and saves current selected index
 * @vue-event {Event} handle_time_unit - Tracks which unit of time has been selected from dropdown in settings panel
 * @vue-event {Event} clone - Creates blank properties for new pulse placed in protocol order so that each pulse has unique properties and is not affected by one another, a side effect from VueDraggable
 */

export default {
  name: "StimulationStudioDragAndDropPanel",
  components: {
    draggable,
    StimulationStudioWaveformSettingModal,
    StimulationStudioInputModal,
    SmallDropDown,
  },
  props: {
    disable_edits: { type: Boolean, default: false },
  },
  data() {
    return {
      icon_types: ["Monophasic", "Biphasic", "Delay"],
      time_units_array: ["milliseconds", "seconds", "minutes", "hours"],
      selected_pulse_settings: {},
      protocol_order: [],
      modal_type: null,
      setting_type: "Current",
      dbl_click_pulse_idx: null,
      open_delay_modal: false,
      current_input: null,
      current_delay_unit: "milliseconds",
      cloned: false,
      new_cloned_idx: null,
      modal_open_for_edit: false, // TODO Luci, clean up state management and constant names
      time_units_idx: 0,
      disable_dropdown: false,
      is_dragging: false,
      selected_color: null,
      open_repeat_modal: false,
      dbl_click_pulse_nested_idx: null,
    };
  },
  computed: {
    ...mapState("stimulation", {
      time_unit: (state) => state.protocol_editor.time_unit,
      run_until_stopped: (state) => state.protocol_editor.run_until_stopped,
      detailed_subprotocols: (state) => state.protocol_editor.detailed_subprotocols,
    }),
    is_nesting_disabled: function () {
      // disable nesting if the dragged pulse is a nested loop already to prevent deep nesting
      // OR a new pulse is being placed
      const selected_pulse = this.protocol_order[this.is_dragging];
      return (
        (Number.isInteger(this.is_dragging) && selected_pulse && selected_pulse.type === "loop") ||
        this.cloned
      );
    },
    idx_of_new_loop: function () {
      // dynamically find the correct index to replace with a loop on modal closure
      return this.protocol_order.findIndex(
        (protocol) => protocol.subprotocols.length > 0 && protocol.type !== "loop"
      );
    },
    is_modal_open: function () {
      return this.modal_type !== null || this.open_delay_modal || this.open_repeat_modal;
    },
  },
  watch: {
    is_dragging: function () {
      // reset so old position/idx isn't highlighted once moved
      this.on_pulse_mouseleave();
    },
    detailed_subprotocols: function () {
      this.protocol_order = JSON.parse(
        JSON.stringify(
          this.detailed_subprotocols.map((protocol) =>
            protocol.type !== "loop"
              ? {
                  ...protocol,
                  subprotocols: [],
                }
              : protocol
          )
        )
      );
    },
  },
  created() {
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.protocol_order = [];
      } else if (mutation.type === "stimulation/set_edit_mode") {
        this.protocol_order = JSON.parse(JSON.stringify(this.detailed_subprotocols));
        this.time_units_idx = this.time_units_array.indexOf(this.time_unit);
      } else if (mutation.type === "stimulation/set_stop_setting") {
        this.disable_dropdown = !this.run_until_stopped;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapActions("stimulation", ["handle_protocol_order", "on_pulse_mouseenter"]),
    ...mapMutations("stimulation", ["set_time_unit", "on_pulse_mouseleave"]),

    check_type(e) {
      if (e.added && this.cloned) {
        const { element, newIndex } = e.added;
        this.new_cloned_idx = newIndex;
        this.selected_pulse_settings = element.pulse_settings;
        this.selected_color = element.color;

        if (["Monophasic", "Biphasic"].includes(element.type)) this.modal_type = element.type;
        else if (element.type === "Delay") this.open_delay_modal = true;
      } else if (e.removed) {
        // if a tile on the left side of another is dragged and dropped into the right subprotocol loop, for some reason the change only gets caught here
        // need to basically mimic the handle_protocol_loop({e: {added: {}}}) event
        if (!this.dbl_click_pulse_idx && this.idx_of_new_loop !== -1) {
          this.dbl_click_pulse_idx = this.idx_of_new_loop;
          this.selected_pulse_settings = e.removed.element;
          this.open_repeat_modal = true;
        }
      }

      if ((e.added && !this.cloned) || e.moved || e.removed) this.handle_protocol_order(this.protocol_order);
      // reset
      this.cloned = false;
    },
    on_modal_close(button, pulse_settings, selected_color) {
      this.modal_type = null;
      this.current_input = null;
      this.current_delay_unit = "milliseconds";
      this.selected_color = null;

      if (this.new_cloned_idx !== null) {
        this.handle_new_settings(button, pulse_settings, selected_color);
      } else if (isNaN(this.dbl_click_pulse_nested_idx)) {
        this.handle_edited_settings(button, pulse_settings, selected_color);
      } else {
        this.handle_nested_settings(button, pulse_settings, selected_color);
      }
    },
    start_dragging({ oldIndex }) {
      this.is_dragging = oldIndex;
    },
    handle_new_settings(button, pulse_settings, selected_color) {
      const new_pulse = this.protocol_order[this.new_cloned_idx];
      switch (button) {
        case "Save":
          new_pulse.color = selected_color;
          Object.assign(new_pulse.pulse_settings, pulse_settings);
          break;
        case "Cancel":
          this.protocol_order.splice(this.new_cloned_idx, 1);
      }
      this.new_cloned_idx = null;
      this.open_delay_modal = false;
      this.handle_protocol_order(this.protocol_order);
    },
    handle_edited_settings(button, pulse_settings, selected_color) {
      const edited_pulse = this.protocol_order[this.dbl_click_pulse_idx];
      const duplicate_pulse = JSON.parse(JSON.stringify(edited_pulse));
      // change color and insert after original pulse
      const previous_hue = this.get_pulse_hue(this.dbl_click_pulse_idx);
      const next_hue =
        this.dbl_click_pulse_idx < this.protocol_order.length - 1
          ? this.get_pulse_hue(this.dbl_click_pulse_idx + 1)
          : undefined;

      switch (button) {
        case "Save":
          Object.assign(edited_pulse.pulse_settings, pulse_settings);
          edited_pulse.color = selected_color;
          break;
        case "Duplicate":
          duplicate_pulse.color = generate_random_color(true, previous_hue, next_hue);
          this.protocol_order.splice(this.dbl_click_pulse_idx + 1, 0, duplicate_pulse);
          break;
        case "Delete":
          this.protocol_order.splice(this.dbl_click_pulse_idx, 1);
          break;
      }

      this.dbl_click_pulse_idx = null;
      this.open_delay_modal = false;
      this.modal_open_for_edit = false;
      this.handle_protocol_order(this.protocol_order);
    },
    async handle_nested_settings(button, pulse_settings, selected_color) {
      const edited_pulse = this.protocol_order[this.dbl_click_pulse_idx];
      // needs to not edit original pulse, edited_pulse does
      const edited_nested_pulse = edited_pulse.subprotocols[this.dbl_click_pulse_nested_idx];
      const edited_nested_pulse_copy = JSON.parse(JSON.stringify(edited_nested_pulse));
      const num_subprotocols = edited_pulse.subprotocols.length;

      switch (button) {
        case "Save":
          Object.assign(edited_nested_pulse.pulse_settings, pulse_settings);
          edited_nested_pulse.color = selected_color;
          break;
        case "Duplicate":
          // generate color considering previous and next pulses colors
          edited_nested_pulse_copy.color = generate_random_color(
            true,
            this.get_pulse_hue(this.dbl_click_pulse_idx, this.dbl_click_pulse_nested_idx),
            this.dbl_click_pulse_nested_idx + 1 < num_subprotocols - 1
              ? this.get_pulse_hue(this.dbl_click_pulse_idx, this.dbl_click_pulse_nested_idx + 1)
              : undefined
          );

          edited_pulse.subprotocols.splice(this.dbl_click_pulse_nested_idx + 1, 0, edited_nested_pulse_copy);
          break;
        case "Delete":
          if (num_subprotocols - 1 === 1) {
            this.protocol_order.splice(
              this.dbl_click_pulse_idx,
              1,
              edited_pulse.subprotocols[this.dbl_click_pulse_nested_idx === 0 ? 1 : 0]
            );
          } else {
            edited_pulse.subprotocols.splice(this.dbl_click_pulse_nested_idx, 1);
          }
          break;
      }

      this.dbl_click_pulse_nested_idx = null;
      this.open_delay_modal = false;
      this.modal_open_for_edit = false;
      this.handle_protocol_order(this.protocol_order);
    },
    close_repeat_modal(button, value) {
      this.open_repeat_modal = false;
      this.current_input = null;
      // create loop object to replace at index in protocol order
      const loop_pulse = {
        type: "loop",
        num_iterations: value,
        subprotocols: [this.protocol_order[this.dbl_click_pulse_idx], this.selected_pulse_settings],
      };

      switch (button) {
        case "Save":
          if (this.modal_open_for_edit) {
            this.protocol_order[this.dbl_click_pulse_idx].num_iterations = value;
          } else {
            this.protocol_order.splice(this.dbl_click_pulse_idx, 1, loop_pulse);
          }
          break;
        case "Duplicate":
          this.protocol_order.splice(
            this.dbl_click_pulse_idx,
            0,
            this.protocol_order[this.dbl_click_pulse_idx]
          );
          break;
        case "Delete":
          this.protocol_order.splice(this.dbl_click_pulse_idx, 1);
          break;
        case "Cancel":
          if (!this.modal_open_for_edit) {
            this.protocol_order.splice(this.dbl_click_pulse_idx + 1, 0, this.selected_pulse_settings);
          }
      }
      this.handle_protocol_order(this.protocol_order);
      this.modal_open_for_edit = false;
      this.dbl_click_pulse_idx = null;
    },
    open_modal_for_edit(type, idx, nested_idx) {
      const pulse =
        nested_idx >= 0 ? this.protocol_order[idx].subprotocols[nested_idx] : this.protocol_order[idx];

      this.dbl_click_pulse_idx = idx;
      this.dbl_click_pulse_nested_idx = nested_idx;
      this.modal_open_for_edit = true;
      this.selected_pulse_settings = pulse.pulse_settings;
      this.selected_color = pulse.color;

      if (["Monophasic", "Biphasic"].includes(type)) {
        this.modal_type = type;
      } else if (type === "Delay") {
        const { duration, unit } = this.selected_pulse_settings;
        this.current_input = duration.toString();
        this.current_delay_unit = unit.toString();
        this.open_delay_modal = true;
      }
    },
    on_pulse_enter(idx, nested_idx) {
      // if tile is being dragged, the pulse underneath the dragged tile will highlight even though the user is dragging a different tile
      // 0 index is considered falsy
      if (!this.is_dragging && this.is_dragging !== 0 && !this.is_modal_open)
        this.on_pulse_mouseenter({ idx, nested_idx });
    },
    on_pulse_leave() {
      this.on_pulse_mouseleave();
    },
    handle_time_unit(idx) {
      const unit = this.time_units_array[idx];
      this.time_units_idx = idx;
      this.set_time_unit(unit);
      this.handle_protocol_order(this.protocol_order);
    },
    get_pulse_hue(idx, nested_idx) {
      // duplicated pulses are not always in last index
      const pulse_idx = idx ? idx : this.protocol_order.length - 1;

      const selected_pulse = this.protocol_order[pulse_idx];
      const { subprotocols } = selected_pulse;

      const last_pulse_hsla =
        selected_pulse.type !== "loop"
          ? selected_pulse.color
          : subprotocols[nested_idx >= 0 ? nested_idx : subprotocols.length - 1].color;

      return last_pulse_hsla.split("(")[1].split(",")[0];
    },
    get_border_style(type) {
      if (type.type === "loop") {
        const consistent_color_to_use = type.subprotocols[0].color;
        return "border: 2px solid " + consistent_color_to_use;
      }
    },
    clone(type) {
      this.cloned = true;

      const random_color =
        this.protocol_order.length > 0
          ? generate_random_color(true, this.get_pulse_hue())
          : generate_random_color(true);

      this.selected_color = random_color;
      // have to make a deep copy to prevent changing original template state
      const template_copy = JSON.parse(JSON.stringify(DEFAULT_SUBPROTOCOL_TEMPLATES[type.toUpperCase()]));

      return {
        ...template_copy,
        color: random_color,
      };
    },
    open_repeat_modal_for_edit(number, idx) {
      this.dbl_click_pulse_idx = idx;
      this.current_input = number.toString();
      this.modal_open_for_edit = true;
      this.open_repeat_modal = true;
    },
    handle_protocol_loop(e) {
      if (e.added) {
        if (this.idx_of_new_loop !== -1 && this.protocol_order[this.idx_of_new_loop].type !== "loop") {
          this.dbl_click_pulse_idx = this.idx_of_new_loop;
          this.selected_pulse_settings = e.added.element;
          this.open_repeat_modal = true;
        } else {
          this.handle_protocol_order(this.protocol_order);
        }
      } else if (e.moved) {
        this.handle_protocol_order(this.protocol_order);
      } else if (e.removed) {
        // if last nested subprotocol is removed from loop so there is only one left,
        // then replace loop object with last subprotocol object
        this.protocol_order = this.protocol_order.map((protocol) =>
          protocol.type === "loop" && protocol.subprotocols.length === 1 ? protocol.subprotocols[0] : protocol
        );

        this.handle_protocol_order(this.protocol_order);
      }
    },
  },
};
</script>
<style scoped>
.div__sidebar-block {
  z-index: 999;
  background: black;
  position: absolute;
  opacity: 0.6;
  height: 885px;
  width: 300px;
  left: 1329px;
  top: 0px;
  left: 0px;
}

.div__drag-and-drop-panel {
  background: rgb(17, 17, 17);
  position: absolute;
  width: 300px;
  height: 885px;
  bottom: 0;
  left: 1329px;
  display: flex;
  justify-content: center;
  justify-self: flex-end;
}

.div__repeat-container {
  display: flex;
  align-items: center;
  padding-left: 1px;
}
.span__repeat-label {
  font-size: 12px;
  font-weight: bold;
  position: relative;
  font-family: Muli;
  color: rgb(17, 17, 17);
}
.div__repeat-label-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  margin-right: 31px;
}

.img__icon-container {
  cursor: pointer;
  height: 93px;
  width: 92px;
}

img {
  height: 92px;
  width: 92px;
  cursor: pointer;
}

.ghost {
  padding: 0 7px;
}

.modal-container {
  left: 22%;
  position: absolute;
}

.dropdown-container {
  position: absolute;
  z-index: 2;
  top: 412px;
  left: 1184px;
}

.dragArea {
  height: 98px;
  display: flex;
  padding-top: 4px;
}

.div__circle {
  width: 30px;
  height: 30px;
  border: 1px solid #222;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #b7b7b7;
  cursor: pointer;
}

.draggable__tile-container {
  display: grid;
  width: 80%;
  grid-template-columns: 50% 50%;
  grid-template-rows: 15% 15% 70%;
  justify-items: center;
  align-items: center;
  margin-top: 80px;
}

.div__modal-overlay {
  width: 1629px;
  height: 885px;
  position: absolute;
  top: 0;
  background: rgb(0, 0, 0);
  z-index: 5;
  opacity: 0.6;
}

.div__scroll-container {
  position: absolute;
  top: 460px;
  width: 1301px;
  height: 107px;
  right: 312px;
  background: rgb(17, 17, 17);
  overflow-x: scroll;
  overflow-y: hidden;
  z-index: 1;
  white-space: nowrap;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  height: 8px;
  overflow: visible;
}

::-webkit-scrollbar-thumb {
  background-color: #2f2f2f;
  overflow: visible;
}

::-webkit-scrollbar-track {
  background-color: #1c1c1c;
  overflow: visible;
}

.span__stimulationstudio-drag-drop-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  padding-top: 25px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.canvas__stimulationstudio-header-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 272px;
  height: 2px;
  top: 65px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.dropzone {
  visibility: visible;
  height: 102px;
  display: flex;
  right: 31px;
  position: relative;
}

.delay-container,
.repeat-container {
  top: 15%;
}
</style>
