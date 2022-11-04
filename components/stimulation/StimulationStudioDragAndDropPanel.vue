<template>
  <div>
    <div :class="modal_type !== null || open_delay_modal ? 'modal_overlay' : null">
      <div>
        <div class="div__DragAndDdrop-panel">
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
            class="draggable_tile_container"
            :disabled="disable_edits"
            :group="{ name: 'order', pull: 'clone', put: false }"
            :clone="clone"
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
            @start="is_dragging = true"
            @end="is_dragging = false"
          >
            <div v-for="(types, idx) in protocol_order" :key="idx" class="div__tile-container">
              <img
                id="img__waveform-tile"
                :src="require(`@/assets/img/${types.type}.png`)"
                @dblclick="open_modal_for_edit(types.type, idx)"
                @mouseenter="on_pulse_enter(idx)"
                @mouseleave="on_pulse_leave"
              />
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div v-if="modal_type !== null" class="modal-container">
      <StimulationStudioWaveformSettingModal
        :stimulation_type="stimulation_type"
        :pulse_type="modal_type"
        :modal_open_for_edit="modal_open_for_edit"
        :selected_pulse_settings="selected_pulse_settings"
        :current_color="selected_color"
        @close="on_modal_close"
      />
    </div>
    <div v-if="open_delay_modal" class="modal-container delay-container">
      <StimulationStudioDelayModal
        :modal_open_for_edit="modal_open_for_edit"
        :current_delay_unit="current_delay_unit"
        :current_delay_input="current_delay_input"
        :current_color="selected_color"
        @delay_close="on_modal_close"
      />
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapState, mapActions, mapMutations } from "vuex";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import StimulationStudioDelayModal from "@/components/stimulation/StimulationStudioDelayModal.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import { generate_random_color } from "@/js_utils/waveform_data_formatter";

/**
 * @vue-props {String} stimulation_type - Current selected stimulation type user selects from drowdown
 * @vue-data {Array} icon_type - The source for the draggable pulse tiles
 * @vue-data {Array} is_dragging - Boolean to determine if user is currently dragging a tile in the scrollable window
 * @vue-data {Array} time_units_array - Available units of time for drop down in settings panel
 * @vue-data {Object} selected_pulse_settings - This is the saved setting for a pulse that changes when a user opens a modal to edit a pulse
 * @vue-data {Array} protocol_order -  This is the complete order of pulses/delays/repeats in the entire new protocol
 * @vue-data {String} modal_type - Tracks which modal should open based on pulse type
 * @vue-data {String} setting_type - This is the stimulation type that user selects from drop down in settings panel
 * @vue-data {Int} shift_click_img_idx - Index of selected pulse to edit in order to save new settings to correct pulse
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
    StimulationStudioDelayModal,
    SmallDropDown,
  },
  props: {
    stimulation_type: { type: String, default: "Voltage" },
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
      shift_click_img_idx: null,
      open_delay_modal: false,
      current_delay_input: null,
      current_delay_unit: "milliseconds",
      cloned: false,
      new_cloned_idx: null,
      modal_open_for_edit: false, // TODO Luci, clean up state management and constant names
      time_units_idx: 0,
      disable_dropdown: false,
      is_dragging: false,
      selected_color: null,
    };
  },
  computed: {
    ...mapState("stimulation", {
      time_unit: (state) => state.protocol_editor.time_unit,
      run_until_stopped: (state) => state.protocol_editor.run_until_stopped,
      detailed_subprotocols: (state) => state.protocol_editor.detailed_subprotocols,
    }),
  },
  watch: {
    is_dragging: function () {
      // reset so old position/idx isn't highlighted once moved
      this.on_pulse_mouseleave();
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

        if (element.type === "Monophasic") this.modal_type = "Monophasic";
        else if (element.type === "Biphasic") this.modal_type = "Biphasic";
        else if (element.type === "Delay") this.open_delay_modal = true;
      }

      if ((e.added && !this.cloned) || e.moved || e.removed) this.handle_protocol_order(this.protocol_order);
      // reset
      this.cloned = false;
    },
    on_modal_close(button, pulse_settings, selected_color) {
      this.modal_type = null;
      this.open_delay_modal = false;
      this.modal_open_for_edit = false;
      this.current_delay_input = null;
      this.current_delay_unit = "milliseconds";
      this.selected_color = null;

      switch (button) {
        case "Save":
          if (this.new_cloned_idx !== null) {
            const new_pulse = this.protocol_order[this.new_cloned_idx];
            new_pulse.pulse_settings = pulse_settings;
            new_pulse.color = selected_color;
            Object.assign(this.protocol_order[this.new_cloned_idx], new_pulse);
          }
          if (this.shift_click_img_idx !== null) {
            const edited_pulse = this.protocol_order[this.shift_click_img_idx];

            Object.assign(edited_pulse.pulse_settings, pulse_settings);
            Object.assign(this.protocol_order[this.shift_click_img_idx], edited_pulse);
            edited_pulse.color = selected_color;
          }
          break;
        case "Duplicate":
          // eslint-disable-next-line no-case-declarations
          const duplicate_pulse = // needs to not edit original pulse, edited_pulse does
            this.shift_click_img_idx !== null
              ? JSON.parse(JSON.stringify(this.protocol_order[this.shift_click_img_idx]))
              : null;

          // change color and insert after original pulse
          // eslint-disable-next-line no-case-declarations
          const previous_hue = this.get_pulse_hue(this.shift_click_img_idx);
          // eslint-disable-next-line no-case-declarations
          const next_hue =
            this.shift_click_img_idx < this.protocol_order.length - 1
              ? this.get_pulse_hue(this.shift_click_img_idx + 1)
              : undefined;

          duplicate_pulse.color = generate_random_color(true, previous_hue, next_hue);
          this.protocol_order.splice(this.shift_click_img_idx + 1, 0, duplicate_pulse);
          break;
        case "Delete":
          this.protocol_order.splice(this.shift_click_img_idx, 1);
          break;
        case "Cancel":
          if (this.new_cloned_idx !== null) {
            this.protocol_order.splice(this.new_cloned_idx, 1);
          }
      }
      this.new_cloned_idx = null;
      this.shift_click_img_idx = null;
      this.handle_protocol_order(this.protocol_order);
    },
    open_modal_for_edit(type, idx) {
      const pulse = this.protocol_order[idx];
      this.shift_click_img_idx = idx;
      this.modal_open_for_edit = true;
      this.selected_pulse_settings = pulse.pulse_settings;
      this.selected_color = pulse.color;

      if (type === "Monophasic") {
        this.modal_type = "Monophasic";
      } else if (type === "Biphasic") {
        this.modal_type = "Biphasic";
      } else if (type === "Delay") {
        const { duration, unit } = this.selected_pulse_settings;
        this.current_delay_input = duration.toString();
        this.current_delay_unit = unit.toString();
        this.open_delay_modal = true;
      }
    },
    on_pulse_enter(idx) {
      // if tile is being dragged, the pulse underneath the dragged tile will highlight even though the user is dragging a different tile
      if (!this.is_dragging) this.on_pulse_mouseenter(idx);
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
    get_pulse_hue(idx) {
      // duplicated pulses are not always in last index
      const pulse_idx = idx ? idx : this.protocol_order.length - 1;

      const last_pulse_hsla = this.protocol_order[pulse_idx].color;
      return last_pulse_hsla.split("(")[1].split(",")[0];
    },
    clone(type) {
      this.cloned = true;

      const random_color =
        this.protocol_order.length > 0
          ? generate_random_color(true, this.get_pulse_hue())
          : generate_random_color(true);

      this.selected_color = random_color;

      let type_specific_settings = {};
      if (type === "Delay") type_specific_settings = { duration: "", unit: "milliseconds" };
      // for both monophasic and biphasic
      else
        type_specific_settings = {
          frequency: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
          num_cycles: 0,
          postphase_interval: "",
          phase_one_duration: "",
          phase_one_charge: "",
        };

      if (type === "Biphasic")
        type_specific_settings = {
          ...type_specific_settings,
          interphase_interval: "",
          phase_two_charge: "",
          phase_two_duration: "",
        };

      return {
        type,
        color: `${random_color}`,
        pulse_settings: type_specific_settings,
      };
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

.div__DragAndDdrop-panel {
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

.div__tile-container {
  display: flex;
  align-items: center;
}

.img__icon-container {
  cursor: pointer;
  height: 93px;
  width: 92px;
}

img {
  height: 93px;
  width: 92px;
  cursor: pointer;
}

.ghost {
  padding: 0 7px 7px 7px;
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
  height: 100px;
  display: flex;
  padding-top: 4px;
}

.circle {
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

.draggable_tile_container {
  display: grid;
  width: 80%;
  grid-template-columns: 50% 50%;
  grid-template-rows: 15% 15% 70%;
  justify-items: center;
  align-items: center;
  margin-top: 80px;
}

.modal_overlay {
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
}

.delay-container {
  top: 15%;
}
</style>
