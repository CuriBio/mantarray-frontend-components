<template>
  <div>
    <div :class="modal_type !== null || reopen_modal !== null ? 'modal_overlay' : null">
      <div class="div__background-container">
        <div class="div__DragAndDdrop-panel">
          <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
          <canvas class="canvas__stimulationstudio-header-separator" width="272" height="2" />
          <draggable
            tag="div"
            style="display: flex; width: 100%; justify-content: space-evenly; margin-top: 80px"
            :list="icon_types"
            :group="{ name: 'order', pull: 'clone', put: false }"
          >
            <div v-for="(types, idx) in icon_types" :key="idx">
              <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
            </div>
          </draggable>
        </div>
        <div class="div__scroll-container">
          <draggable
            group="order"
            class="dropzone"
            style="width: 100%; height: 118px; display: flex"
            :list="protocol_order"
            :ghost-class="'ghost'"
            @change="check_type($event)"
          >
            <div
              v-for="(types, idx) in protocol_order"
              :key="idx"
              @click.shift.exact="open_modal_for_edit(types.type, idx)"
            >
              <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div v-if="modal_type !== null" class="modal-container">
      <WaveformSettingModal
        :stimulation_type="stimulation_type"
        :waveform_type="modal_type"
        @close="on_modal_close"
      />
    </div>
    <div v-if="reopen_modal !== null" class="modal-container">
      <WaveformSettingModal
        :stimulation_type="stimulation_type"
        :waveform_type="reopen_modal"
        :button_names="['Save', 'Delete', 'Cancel']"
        :is_enabled_array="[true, true, true]"
        @close="on_modal_close"
      />
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import WaveformSettingModal from "@/components/stimulation/WaveformSettingModal.vue";
import { mapGetters } from "vuex";

export default {
  name: "DragAndDropPanel",
  components: {
    draggable,
    WaveformSettingModal,
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
      if (e.added) {
        const { element } = e.added;
        if (element.type === "Monophasic") this.modal_type = "Monophasic";
        else if (element.type === "Biphasic") this.modal_type = "Biphasic";
      }
    },
    on_modal_close(button) {
      this.modal_type = null;
      this.reopen_modal = null;
      if (button === "Delete") this.protocol_order.splice(this.shift_click_img_idx, 1);
      this.shift_click_img_idx = null;
    },
    open_modal_for_edit(type, idx) {
      if (type === "Monophasic") this.reopen_modal = "Monophasic";
      else if (type === "Biphasic") this.reopen_modal = "Biphasic";
      this.shift_click_img_idx = idx;
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

.div__icon-container {
  margin-top: 80px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  border: 2px solid white;
}

.ghost {
  border: 1px solid #b7b7b7;
  padding: 0 8px 0 8px;
}

.modal-container {
  left: 36%;
  position: absolute;
  top: 8%;
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
