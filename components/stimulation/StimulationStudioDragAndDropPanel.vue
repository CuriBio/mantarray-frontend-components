<template>
  <div>
    <div
      :class="modal_type !== null || reopen_modal !== null || repeat_modal !== null ? 'modal_overlay' : null"
    >
      <div class="div__background-container">
        <div class="div__DragAndDdrop-panel">
          <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
          <canvas class="canvas__stimulationstudio-header-separator" width="272" height="2" />
          <draggable
            v-model="icon_types"
            tag="div"
            style="display: flex; width: 100%; justify-content: space-evenly; margin-top: 80px"
            :group="{ name: 'order', pull: 'clone', put: false }"
            :clone="clone"
          >
            <div v-for="(types, idx) in icon_types" :key="idx">
              <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
            </div>
          </draggable>
        </div>
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
                @change="[types.nested_protocols.length === 1 ? handle_repeat($event, idx) : null]"
              >
                <div
                  v-for="(nested_types, nested_idx) in types.nested_protocols"
                  :key="nested_idx"
                  :style="'position: relative;'"
                  @click.shift.exact="open_modal_for_edit(types.type, idx, nested_idx)"
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
        @close="on_modal_close"
      />
    </div>
    <div v-if="reopen_modal !== null" class="modal-container">
      <StimulationStudioWaveformSettingModal
        :stimulation_type="stimulation_type"
        :waveform_type="reopen_modal"
        :button_names="['Save', 'Delete', 'Cancel']"
        :is_enabled_array="[true, true, true]"
        @close="on_modal_close"
      />
    </div>
    <div v-if="repeat_modal !== null" class="modal-container">
      <StimulationStudioRepeatModal
        :repeat_idx="repeat_idx"
        :current_number_of_repeats="current_number_of_repeats"
        :is_enabled_array="[true, true]"
        @close="on_repeat_modal_close"
      />
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import StimulationStudioRepeatModal from "@/components/stimulation/StimulationStudioRepeatModal.vue";
import { mapGetters } from "vuex";

export default {
  name: "DragAndDropPanel",
  components: {
    draggable,
    StimulationStudioWaveformSettingModal,
    StimulationStudioRepeatModal,
  },
  data() {
    return {
      icon_types: [
        { type: "Monophasic", src: "/Monophasic-tile.png" },
        { type: "Biphasic", src: "/Biphasic-tile.png" },
      ],
      protocol_order: [],
      modal_type: null,
      setting_type: "Current",
      reopen_modal: null,
      shift_click_img_idx: null,
      shift_click_nested_img_idx: null,
      repeat_modal: null,
      repeat_idx: null,
      current_number_of_repeats: null,
      cloned: false,
      new_cloned_idx: null,
    };
  },
  computed: {
    ...mapGetters("stimulation", {
      stimulation_type: "get_stimulation_type",
    }),
  },
  created() {
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/handle_delete_protocol") {
        this.protocol_order = [];
        this.$store.state.stimulation.delete_protocol = false;
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
        if (element.type === "Monophasic") this.modal_type = "Monophasic";
        else if (element.type === "Biphasic") this.modal_type = "Biphasic";
      }
      this.cloned = false;
    },
    on_modal_close(button) {
      this.modal_type = null;
      this.reopen_modal = null;
      if (button === "Delete") {
        if (this.shift_click_nested_img_idx !== null) {
          this.protocol_order[this.shift_click_img_idx].nested_protocols.splice(
            this.shift_click_nested_img_idx,
            1
          );
        } else if (this.shift_click_nested_img_idx === null) {
          this.protocol_order.splice(this.shift_click_img_idx, 1);
        }
      }
      if (button === "Cancel" && this.new_cloned_idx !== null) {
        this.protocol_order.splice(this.new_cloned_idx, 1);
        this.new_cloned_idx = null;
      }
      this.shift_click_img_idx = null;
      this.shift_click_nested_img_idx = null;
    },
    open_modal_for_edit(type, idx, nested_idx) {
      if (type === "Monophasic") this.reopen_modal = "Monophasic";
      else if (type === "Biphasic") this.reopen_modal = "Biphasic";
      if (nested_idx !== undefined) this.shift_click_nested_img_idx = idx;
      this.shift_click_img_idx = idx;
    },
    clone(type) {
      this.cloned = true;
      const random_color = Math.floor(Math.random() * 16777215).toString(16);
      return {
        type: type.type,
        src: type.src,
        nested_protocols: [],
        repeat: { color: random_color, number_of_repeats: 0 },
      };
    },
    handle_repeat(e, idx) {
      if (e.added) {
        this.repeat_modal = true;
        this.repeat_idx = idx;
      }
    },
    open_repeat_modal_for_edit(number, idx) {
      this.current_number_of_repeats = number;
      this.repeat_modal = true;
      this.repeat_idx = idx;
    },
    get_style(type) {
      if (type.nested_protocols.length > 0) return "border: 2px solid #" + type.repeat.color;
    },
    on_repeat_modal_close(res) {
      this.repeat_modal = null;
      if (res.button_label === "Save")
        this.protocol_order[this.repeat_idx].repeat.number_of_repeats = res.number_of_repeats;
      if (res.button_label === "Cancel") this.protocol_order[this.repeat_idx].nested_protocols = [];
      this.repeat_idx = null;
      this.current_number_of_repeats = null;
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
