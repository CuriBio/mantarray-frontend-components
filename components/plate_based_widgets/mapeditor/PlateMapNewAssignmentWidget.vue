<template>
  <div class="div__platemap-newlabel-backdrop">
    <div class="div__platemap-newlabel-header">Create New Label</div>
    <div class="div__platemap-newlabel-input-container">
      <InputWidget
        :title_label="'Label'"
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
import { mapState } from "vuex";

export default {
  name: "PlateMapNewAssignmentWidget",
  components: { ButtonWidget, InputWidget },
  props: {},
  data() {
    return {
      invalid_text: "Required",
      is_enabled: [true, false],
      input_label_name: "",
      initial_value: "",
    };
  },
  computed: {
    ...mapState("platemap", ["well_assignments"]),
    assignment_names: function () {
      return this.well_assignments.map(({ name }) => name);
    },
  },
  methods: {
    on_update_name: function (new_value) {
      if (new_value.length === 0) {
        this.invalid_text = "Required";
        this.is_enabled = [true, false];
      } else if (this.assignment_names.includes(new_value)) {
        this.invalid_text = "This name is already taken";
        this.is_enabled = [true, false];
      } else {
        this.invalid_text = "";
        this.is_enabled = [true, true];
      }

      this.input_label_name = new_value;
      this.initial_value = new_value;
    },
    handle_btn_click: function (idx) {
      // if saved, set to data state
      if (idx === 1) {
        this.$store.commit("platemap/set_new_well_assignment", this.input_label_name);
      }
      // reset
      this.initial_value = "";
      // always emit to close modal regardless of button selected
      this.$emit("close_modal", idx);
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
