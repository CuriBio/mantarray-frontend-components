<template>
  <div class="div__simulationstudio-backdrop">
    <span class="span__stimulationstudio-layout-create_edit-header-label"
      >Create/Edit Stimulation Protocol</span
    >
    <span class="span__stimulationstudio-layout-subheader-label">Select/Create Protocol</span>
    <div class="div__stimulationstudio-select-dropdown-container">
      <SelectDropDown
        :options_text="protocol_list"
        :input_width="input_width"
        :input_height="input_height"
        @selection-changed="selected_protocol_change"
      />
    </div>
    <canvas class="canvas__stimulationstudio-button-separator" />
    <div
      v-for="(key, value, idx) in btn_labels"
      :id="value"
      :key="value"
      :class="get_class(idx)"
      :style="key"
      @click.exact="handle_click(idx)"
    >
      <span :class="get_label_class(idx)">{{ value }}</span>
    </div>
    <div
      v-for="(key, value, idx) in import_export_btn_labels"
      :id="value"
      :key="value"
      @click.exact="handle_import_export(idx)"
    >
      <div :class="'div__stimulationstudio-btn-container'" :style="key">
        <span type="button" :class="'span__stimulationstudio-btn-label'">{{ value }}</span>
        <input ref="file" type="file" style="display: none" @change="handle_import($event.target.files)" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
import { mapActions, mapMutations } from "vuex";

/**
 * @vue-data {Object} btn_labels - Label and style of buttons
 * @vue-data {Object} import_export_btn_labels - Label and style of export and import buttons
 * @vue-data {Int} selected_protocol_idx - Index of selected protocol from dropdown
 * @vue-data {Int} input_height - Height passed down to dropdown for styling
 * @vue-data {Int} input_width -  Width passed down to dropdown for styling
 * @vue-data {Array} protocol_list - Availble protocols to display in dropdown
 * @vue-event {Event} update_protocols - Gets called when a change to the available protocol list occurs to update next available color/letter assignment and dropdown options
 * @vue-event {Event} selected_protocol_change - Changes when a new protocol is selected from dropdown
 * @vue-event {Event} handle_click - Performs functions based on which button is clicked regarding assigning and clearing protocols from plate editor
 * @vue-event {Event} get_class - Dynamically renders button class depending on if button is disabled
 * @vue-event {Event} get_label_class - Dynamically renders button labels class depending on if button is disabled
 * @vue-event {Event} handle_import_export - On click, it reassigns function to input[type=file] to upload file
 * @vue-event {Event} handle_import - Dispatches imported file to be handled in store
 * @vue-event {Event} handle_export - Dispatches request to store to write current protocol
 */

export default {
  name: "StimulationStudioCreateAndEdit",
  components: {
    SelectDropDown,
  },
  props: {
    disable_edits: { type: Boolean, default: false }, // TODO actually pass this prop in
  },
  data() {
    return {
      btn_labels: {
        "Apply to Selection": " left: 19%; top: 49%; ",
        "Clear Selection": " left: 51%; top: 49%; ",
      },
      import_export_btn_labels: {
        "Import Protocol(s)": " left: 19%; top: 76%; width: 30%;",
        "Export Protocol(s)": " left: 51%; top: 76%; width: 30%;",
      },
      selected_protocol_idx: 0,
      input_height: 45,
      input_width: 600,
      protocol_list: [],
    };
  },
  created() {
    this.update_protocols();
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/set_new_protocol" ||
        mutation.type === "stimulation/set_edit_mode_off"
      ) {
        this.update_protocols();
        this.selected_protocol_idx = 0;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapActions("stimulation", [
      "edit_selected_protocol",
      "handle_import_protocol",
      "handle_export_protocol",
    ]),
    ...mapMutations("stimulation", [
      "set_edit_mode_off",
      "reset_protocol_editor",
      "clear_selected_protocol",
      "apply_selected_protocol",
      "set_selected_protocol_for_edit",
    ]),
    update_protocols() {
      this.protocol_list = this.$store.getters["stimulation/get_protocols"];
    },
    async selected_protocol_change(idx) {
      this.selected_protocol_idx = idx;
      const selected_protocol = this.protocol_list[idx];

      if (idx === 0) {
        this.set_edit_mode_off();
        this.reset_protocol_editor();
      } else await this.edit_selected_protocol(selected_protocol);

      this.$emit("handle_selection_change", selected_protocol);
    },
    disable_selection_btn(idx) {
      return this.disable_edits || (this.selected_protocol_idx === 0 && idx === 0);
    },
    handle_click(idx) {
      if (this.disable_selection_btn(idx)) {
        return;
      }

      if (idx === 0) {
        const selected_protocol = this.protocol_list[this.selected_protocol_idx];
        this.apply_selected_protocol(selected_protocol);
      } else if (idx === 1) {
        this.clear_selected_protocol();
      }
    },
    get_class(idx) {
      return this.disable_selection_btn(idx)
        ? "div__stimulationstudio-btn-container-disable"
        : "div__stimulationstudio-btn-container";
    },
    get_label_class(idx) {
      return this.disable_selection_btn(idx)
        ? "span__stimulationstudio-btn-label-disable"
        : "span__stimulationstudio-btn-label";
    },
    handle_import_export(idx) {
      if (idx === 0) {
        this.$refs.file[idx].click();
      } else if (idx === 1) {
        this.handle_export();
      }
    },
    handle_import(file) {
      this.handle_import_protocol(file[0]);
    },
    handle_export() {
      this.handle_export_protocol();
    },
  },
};
</script>

<style scoped>
.div__simulationstudio-backdrop {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 640px;
  height: 280px;
  visibility: visible;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  z-index: 2;
}

.span__stimulationstudio-layout-create_edit-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  padding-top: 15px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.span__stimulationstudio-layout-subheader-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  top: 45px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
}

.div__stimulationstudio-select-dropdown-container {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 210px;
  height: 50px;
  top: 75px;
  right: 410px;
  padding: 5px;
  z-index: 3;
}

.div__stimulationstudio-select-dropdown-container > .div__input-dropdown-background {
  background: none;
  border: none;
}

.div__stimulationstudio-btn-container {
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  width: 30%;
  height: 45px;
  background: #b7b7b7;
}

.div__stimulationstudio-btn-container-disable {
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  width: 30%;
  height: 45px;
  background: #b7b7b7c9;
}

.div__stimulationstudio-btn-container:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}

.span__stimulationstudio-btn-label {
  transform: translateZ(0px);
  line-height: 45px;
  font-family: Muli;
  font-size: 16px;
  color: rgb(0, 0, 0);
}

.span__stimulationstudio-btn-label-disable {
  transform: translateZ(0px);
  line-height: 45px;
  font-family: Muli;
  font-size: 16px;
  color: #6e6f72;
}

.canvas__stimulationstudio-button-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 620px;
  height: 2px;
  top: 70%;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}
</style>
