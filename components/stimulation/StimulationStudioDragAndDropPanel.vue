<template>
  <div>
    <div
      :class="
        modal_type !== null || reopen_modal !== null || repeat_delay_modal !== null ? 'modal_overlay' : null
      "
    >
      <div class="div__background-container">
        <div class="div__DragAndDdrop-panel">
          <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
          <canvas class="canvas__stimulationstudio-header-separator" />
          <draggable
            v-model="icon_types"
            tag="div"
            class="draggable_tile_container"
            :group="{ name: 'order', pull: 'clone', put: false }"
            :clone="clone"
          >
            <div v-for="(types, idx) in icon_types" :key="idx">
              <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
            </div>
          </draggable>
        </div>
        <SmallDropDown
          class="dropdown-container"
          :input_height="25"
          :input_width="95"
          :options_text="time_units_array"
          @selection-changed="handle_time_unit"
        />

        <div class="div__scroll-container">
          <draggable
            v-model="protocol_order"
            class="dragArea"
            style="height: 118px; display: flex"
            :group="{ name: 'order' }"
            :ghost-class="'ghost'"
            @change="check_type($event)"
          >
            <div
              v-for="(types, idx) in protocol_order"
              :key="idx"
              :class="'repeat_container'"
              :style="get_style(types)"
            >
              <div v-if="types.nested_protocols.length > 0" :class="'repeat_label_container'">
                <div
                  class="circle"
                  @click.shift.exact="open_repeat_modal_for_edit(types.repeat.number_of_repeats, idx)"
                >
                  <span :class="'repeat_label'">
                    {{ types.repeat.number_of_repeats }}
                  </span>
                </div>
              </div>
              <img
                :src="types.src"
                :style="'cursor: pointer;'"
                @click.shift.exact="open_modal_for_edit(types.type, idx)"
              />

              <draggable
                v-model="types.nested_protocols"
                class="dropzone"
                style="height: 120px; display: flex"
                :group="{ name: 'order' }"
                :ghost-class="'ghost'"
                :emptyInsertThreshold="40"
                @change="
                  [types.nested_protocols.length <= 1 ? handle_repeat($event, idx) : handle_internal_repeat()]
                "
              >
                <div
                  v-for="(nested_types, nested_idx) in types.nested_protocols"
                  :key="nested_idx"
                  :style="'position: relative;'"
                  @click.shift.exact="open_modal_for_edit(nested_types.type, idx, nested_idx)"
                >
                  <img :src="nested_types.src" :style="'margin-top: 8px; cursor: pointer;'" />
                </div>
              </draggable>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div v-if="modal_type !== null" class="modal-container">
      <StimulationStudioWaveformSettingModal
        :stimulation_type="stimulation_type"
        :waveform_type="modal_type"
        :button_names="
          shift_click_img_idx !== null ? button_labels.delete_option : button_labels.no_delete_option
        "
        :selected_waveform_settings="selected_waveform_settings"
        @close="on_modal_close"
      />
    </div>
    <div v-if="repeat_delay_modal !== null" class="modal-container">
      <StimulationStudioRepeatDelayModal
        :delay_open_for_edit="delay_open_for_edit"
        :repeat_idx="repeat_idx"
        :modal_type="repeat_delay_modal"
        :current_repeat_delay_input="current_repeat_delay_input"
        :is_enabled_array="[true, true, true]"
        @repeat_close="on_repeat_modal_close"
        @delay_close="on_modal_close"
      />
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import StimulationStudioRepeatDelayModal from "@/components/stimulation/StimulationStudioRepeatDelayModal.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";

export default {
  name: "DragAndDropPanel",
  components: {
    draggable,
    StimulationStudioWaveformSettingModal,
    StimulationStudioRepeatDelayModal,
    SmallDropDown,
  },
  props: {
    stimulation_type: { type: String, default: "Voltage (V)" },
  },
  data() {
    return {
      icon_types: [
        { type: "Monophasic", src: "/monophasic-tile.png" },
        { type: "Biphasic", src: "/biphasic-tile.png" },
        { type: "Delay", src: "/delay-tile.png" },
      ],
      button_labels: {
        no_delete_option: ["Save", "Cancel"],
        delete_option: ["Save", "Delete", "Cancel"],
      },
      time_units_array: ["seconds", "milliseconds", "minutes", "hours"],
      selected_waveform_settings: null,
      protocol_order: [],
      modal_type: null,
      setting_type: "Current",
      reopen_modal: null,
      shift_click_img_idx: null,
      shift_click_nested_img_idx: null,
      repeat_delay_modal: null,
      repeat_idx: null,
      current_repeat_delay_input: null,
      cloned: false,
      new_cloned_idx: null,
      delay_open_for_edit: false, // TODO Luci, clean up state management and constant names
    };
  },
  created() {
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/reset_state") {
        this.protocol_order = [];
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    check_type(e) {
      if (e.added && this.cloned) {
        const { element, newIndex } = e.added;
        this.new_cloned_idx = newIndex;
        this.selected_waveform_settings = element.settings;
        if (element.type === "Monophasic") this.modal_type = "Monophasic";
        else if (element.type === "Biphasic") this.modal_type = "Biphasic";
        else if (element.type === "Delay") this.repeat_delay_modal = "Delay";
      }
      if ((e.added && !this.cloned) || e.moved || e.removed)
        this.$store.dispatch("stimulation/handle_protocol_order", this.protocol_order);
      this.cloned = false;
    },
    on_modal_close(button, settings) {
      this.modal_type = null;
      this.reopen_modal = null;
      this.repeat_delay_modal = null;
      this.delay_open_for_edit = false;
      this.current_repeat_delay_input = null;
      if (button === "Save") {
        if (this.new_cloned_idx !== null) this.protocol_order[this.new_cloned_idx].settings = settings;
        if (this.shift_click_img_idx !== null && this.shift_click_nested_img_idx === null)
          this.protocol_order[this.shift_click_img_idx].settings = settings;
        if (this.shift_click_img_idx !== null && this.shift_click_nested_img_idx !== null)
          this.protocol_order[this.shift_click_img_idx].nested_protocols[
            this.shift_click_nested_img_idx
          ].settings = settings;
      }
      if (button === "Delete") {
        if (this.shift_click_nested_img_idx !== null)
          this.protocol_order[this.shift_click_img_idx].nested_protocols.splice(
            this.shift_click_nested_img_idx,
            1
          );
        if (this.shift_click_nested_img_idx === null) this.protocol_order.splice(this.shift_click_img_idx, 1);
      }
      if (button === "Cancel") {
        if (this.new_cloned_idx !== null) this.protocol_order.splice(this.new_cloned_idx, 1);
      }
      this.new_cloned_idx = null;
      this.shift_click_img_idx = null;
      this.shift_click_nested_img_idx = null;
      this.$store.dispatch("stimulation/handle_protocol_order", this.protocol_order);
    },
    open_modal_for_edit(type, idx, nested_idx) {
      const pulse = this.protocol_order[idx];
      this.selected_waveform_settings = pulse.settings;
      this.shift_click_img_idx = idx;
      if (nested_idx !== undefined) {
        this.shift_click_nested_img_idx = nested_idx;
        this.selected_waveform_settings = pulse.nested_protocols[nested_idx].settings;
      } else if (nested_idx === undefined) {
        this.selected_waveform_settings = pulse.settings;
      }
      if (type === "Monophasic") this.modal_type = "Monophasic";
      if (type === "Biphasic") this.modal_type = "Biphasic";
      if (type === "Delay") {
        this.current_repeat_delay_input = this.selected_waveform_settings.phase_one_duration.toString();
        this.delay_open_for_edit = true;
        this.repeat_delay_modal = "Delay";
      }
    },
    // TODO Luci, fix CSS to move this dropdown back to BlockViewEditor component
    handle_time_unit(idx) {
      const unit = this.time_units_array[idx];
      this.$store.commit("stimulation/set_time_unit", unit);
    },
    clone(type) {
      this.cloned = true;
      const random_color = Math.floor(Math.random() * 16777215).toString(16);
      return {
        type: type.type,
        src: type.src,
        nested_protocols: [],
        repeat: { color: random_color, number_of_repeats: 0 },
        settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interpulse_duration: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
      };
    },
    handle_repeat(e, idx) {
      if (e.added) {
        this.repeat_delay_modal = "Repeat";
        this.repeat_idx = idx;
      }
      if (e.removed) {
        this.protocol_order[idx].repeat.number_of_repeats = 0;
        this.$store.dispatch("stimulation/handle_protocol_order", this.protocol_order);
      }
    },
    handle_internal_repeat() {
      this.$store.dispatch("stimulation/handle_protocol_order", this.protocol_order);
    },
    open_repeat_modal_for_edit(number, idx) {
      this.current_repeat_delay_input = number;
      this.repeat_delay_modal = "Repeat";
      this.repeat_idx = idx;
    },
    on_repeat_modal_close(res) {
      this.repeat_delay_modal = null;
      if (res.button_label === "Save")
        this.protocol_order[this.repeat_idx].repeat.number_of_repeats = res.number_of_repeats;
      if (res.button_label === "Cancel") this.protocol_order[this.repeat_idx].nested_protocols = [];
      this.repeat_idx = null;
      this.current_repeat_delay_input = null;
      this.$store.dispatch("stimulation/handle_protocol_order", this.protocol_order);
    },
    get_style(type) {
      if (type.nested_protocols.length > 0) return "border: 2px solid #" + type.repeat.color;
    },
  },
};
</script>
<style scoped>
.div__DragAndDdrop-panel {
  background: rgb(17, 17, 17);
  position: absolute;
  width: 23%;
  height: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
}
.repeat_container {
  display: flex;
  align-items: center;
  padding: 6px;
}
.div__icon-container {
  margin-top: 80px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  border: 2px solid white;
}
.ghost {
  padding: 0 8px 0 8px;
}
.modal-container {
  left: 36%;
  position: absolute;
  top: 8%;
}
.dropdown-container {
  position: relative;
  z-index: 2;
  top: 353px;
  left: 640px;
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
.repeat_label_container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
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
.repeat_label {
  font-size: 12px;
  font-weight: bold;
  position: relative;
  font-family: Muli;
  color: rgb(17, 17, 17);
}
.div__background-container {
  position: absolute;
  width: 80%;
  left: 20%;
  height: 94%;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}
.modal_overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgb(0, 0, 0);
  z-index: 5;
  opacity: 0.5;
}
.div__scroll-container {
  position: relative;
  top: 47%;
  width: 73%;
  right: 26%;
  height: 13%;
  overflow-x: scroll;
  background: rgb(27, 27, 27);
  z-index: 1;
  white-space: nowrap;
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
</style>
