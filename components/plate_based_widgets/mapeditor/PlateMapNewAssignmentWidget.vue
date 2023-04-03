<template>
  <div class="div__platemap-newlabel-backdrop">
    <div class="div__platemap-newlabel-header">{{ dynamic_modal_header }}</div>
    <div class="div__platemap-newlabel-input-container">
      <InputWidget
        :title_label="'Label Name'"
        :placeholder="'Define Name'"
        :input_width="300"
        :invalid_text="invalid_text"
        :dom_id_suffix="'assignment-name'"
        :initial_value="initial_value"
        @update:value="on_update_name($event)"
      />
    </div>
    <div class="div__platemap-newlabel-buttons-container">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :is_enabled="is_enabled"
        :button_names="['Close', 'Save']"
        :enabled_color="'#B7B7B7'"
        :hover_color="['#bd4932', '#19ac8a']"
        @btn-click="handle_btn_click"
      />
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import { mapState, mapMutations } from "vuex";
import { TextValidation } from "@/js_utils/text_validation.js";
const TextValidation_Label = new TextValidation("platemap_editor_input");

export default {
  name: "PlateMapNewAssignmentWidget",
  components: { ButtonWidget, InputWidget },
  props: {
    editable_name: { type: String, default: null },
  },
  data() {
    return {
      invalid_text: "Required",
      is_enabled: [true, false],
      input_label_name: "",
      initial_value: this.editable_name,
    };
  },
  computed: {
    ...mapState("platemap", ["well_assignments"]),
    assignment_names: function () {
      return this.well_assignments.map(({ name }) => name);
    },
    dynamic_modal_header: function () {
      return this.editable_name ? "Edit Existing Label" : "Create New Label";
    },
  },
  watch: {
    editable_name: function () {
      this.on_update_name(this.editable_name);
    },
  },
  methods: {
    ...mapMutations("platemap", ["change_existing_name", "set_new_label"]),
    on_update_name: function (new_value) {
      this.invalid_text = TextValidation_Label.validate(new_value);
      if (this.assignment_names.includes(new_value) && !this.editable_name) {
        this.invalid_text = "This name is already taken";
      }

      this.is_enabled = this.invalid_text === "" ? [true, true] : [true, false];

      this.input_label_name = new_value;
      this.initial_value = new_value;
    },
    handle_btn_click: function (idx) {
      // if saved, set to data state
      if (idx === 1) {
        if (this.editable_name) {
          this.change_existing_name({ new_name: this.input_label_name, old_name: this.editable_name });
        } else {
          this.set_new_label(this.input_label_name);
        }
      }
      // always emit to close modal regardless of button selected
      this.$emit("close_modal", idx);
      this.initial_value = "";
    },
  },
};
</script>
<style>
.div__platemap-newlabel-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 500px;
  height: 200px;
  visibility: visible;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.div__platemap-newlabel-header {
  font-family: Muli;
  color: #ffff;
  font-size: 20px;
  margin: 20px;
}
.div__platemap-newlabel-input-container {
  position: relative;
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
}
.div__platemap-newlabel-buttons-container {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
