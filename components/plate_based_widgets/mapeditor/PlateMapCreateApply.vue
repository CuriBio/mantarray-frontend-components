<template>
  <div class="div__platemap-createapply-backdrop">
    <div class="div__platemap-createapply-header">Map Settings</div>
    <div class="div__platemap-select-dropdown-container" :style="'z-index: 8;'">
      <SelectDropDown
        :options_text="platemap_names"
        :input_width="300"
        :input_height="45"
        :options_idx="map_options_idx"
        @selection-changed="handle_map_dropdown_selection"
      />
    </div>
    <canvas class="canvas__common-horizontal-line" />
    <div class="div__platemap-createapply-subheader">Well Labels</div>
    <div class="div__platemap-select-dropdown-container">
      <SelectDropDown
        :options_text="well_assignment_names"
        :input_width="300"
        :input_height="45"
        :options_idx="assignment_options_idx"
        @selection-changed="handle_well_dropdown_selection"
      />
    </div>
    <div class="div__platemap-createapply-buttons-container">
      <div
        v-for="(value, idx) in ['Apply Label', 'Create New Label']"
        :id="idx"
        :key="value"
        :class="
          // apply button is only button that could be disabled
          is_apply_create_enabled[idx]
            ? 'div__platemap-createapply-button-background-enabled'
            : 'div__platemap-createapply-button-background-disabled'
        "
        @click.exact="handle_create_apply_click"
      >
        {{ value }}
      </div>
    </div>
    <div class="div__platemap-createapply-buttons-container">
      <div
        v-for="(value, idx) in ['Clear Wells', 'Edit Label']"
        :id="idx"
        :key="value"
        :class="
          is_clear_edit_enabled[idx]
            ? 'div__platemap-createapply-button-background-enabled'
            : 'div__platemap-createapply-button-background-disabled'
        "
        @click.exact="handle_clear_edit_click"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
export default {
  name: "PlateMapCreateApply",
  components: { SelectDropDown },
  data() {
    return {
      assignment_option: null,
      assignment_options_idx: 0,
      map_options_idx: 0,
    };
  },
  computed: {
    ...mapState("platemap", [
      "well_assignments",
      "selected_wells",
      "stored_platemaps",
      "current_platemap_name",
    ]),
    well_assignment_names: function () {
      return this.well_assignments.map(({ name }) => name);
    },
    platemap_names: function () {
      return JSON.parse(JSON.stringify(this.stored_platemaps)).map(({ map_name }) => map_name);
    },
    is_apply_enabled: function () {
      return this.selected_wells.length > 0 && this.assignment_options_idx !== 0;
    },
    is_apply_create_enabled: function () {
      return [this.is_apply_enabled, true];
    },
    is_clear_edit_enabled: function () {
      return [this.selected_wells.length > 0, this.assignment_options_idx > 0];
    },
  },
  watch: {
    current_platemap_name: function () {
      this.check_platemap_dropdown_matches_state();
    },
    well_assignment_names: function (new_names, old_names) {
      // select new assignment once saved to be selected in dropdown
      if (new_names.length > old_names.length) {
        this.handle_well_dropdown_selection(new_names.length - 1);
      }
      // need to reassign here in case a user edits a label name and tries to immediately apply or clear well assignments, the name will be old name before editing
      this.assignment_option = this.well_assignment_names[this.assignment_options_idx];
    },
  },
  mounted() {
    this.check_platemap_dropdown_matches_state();
  },
  methods: {
    ...mapMutations("platemap", [
      "apply_well_assignment",
      "set_entire_platemap",
      "set_platemap_name",
      "clear_selected_wells",
    ]),
    check_platemap_dropdown_matches_state() {
      this.assignment_options_idx = 0; // this resets and so this needs to mirror that change so the edit label button is disabled

      if (this.current_platemap_name !== this.platemap_names[this.map_options_idx]) {
        const platemap_idx = this.platemap_names.indexOf(this.current_platemap_name);
        this.map_options_idx =
          this.current_platemap_name && this.current_platemap_name.length > 0 && platemap_idx > -1
            ? platemap_idx
            : 0;
      }
    },
    handle_create_apply_click: function ({ target }) {
      const idx = Number(target.id);
      if (this.is_apply_create_enabled[idx]) {
        if (idx === 1) this.$emit("handle_modal_open");
        else {
          // prevent button from being clicked when it's disabled
          if (this.is_apply_enabled) this.apply_well_assignment(this.assignment_option);
        }
      }
    },
    handle_clear_edit_click: function ({ target }) {
      const idx = Number(target.id);
      if (this.is_clear_edit_enabled[idx]) {
        if (idx === 1) this.$emit("handle_modal_open", this.assignment_option);
        else {
          // prevent button from being clicked when it's disabled
          this.clear_selected_wells();
        }
      }
    },
    handle_well_dropdown_selection: function (idx) {
      this.assignment_option = this.well_assignment_names[idx];
      this.assignment_options_idx = idx;
    },
    handle_map_dropdown_selection: function (idx) {
      this.map_options_idx = idx;
      const { map_name, labels } = JSON.parse(JSON.stringify(this.stored_platemaps[idx]));
      this.set_platemap_name(idx !== 0 ? map_name : "");
      this.set_entire_platemap(labels);
    },
  },
};
</script>
<style scoped>
.div__platemap-createapply-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 450px;
  height: 335px;
  top: 0px;
  left: 450px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.div__platemap-createapply-header {
  width: 450px;
  text-align: center;
  font-family: Muli;
  height: 55px;
  top: 10px;
  font-size: 20px;
  position: relative;
  color: #ffffff;
}
.div__platemap-createapply-subheader {
  width: 450px;
  text-align: center;
  font-family: Muli;
  height: 45px;
  top: 10px;
  font-size: 18px;
  position: relative;
  color: #b7b7b7;
}
.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: relative;
  height: 2px;
  width: 350px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.div__platemap-createapply-buttons-container {
  display: flex;
  flex-direction: row;
  position: relative;
  height: 70px;
  width: 415px;
  justify-content: center;
  align-items: center;
}
.div__platemap-createapply-color-container {
  position: relative;
  height: 30px;
  width: 400px;
  border: 1px dashed #b7b7b7c9;
  margin: 7px;
}

.div__platemap-createapply-button-background-enabled {
  background: #b7b7b7;
  height: 45px;
  line-height: 2.5;
  position: relative;
  width: 220px;
  margin: 10px;
  text-align: center;
  font-size: 16px;
  font-family: Muli;
  color: #111;
}
.div__platemap-createapply-button-background-disabled {
  background: #b7b7b7c9;
  height: 45px;
  line-height: 2.5;
  position: relative;
  color: #636262;
  width: 220px;
  margin: 10px;
  text-align: center;
  font-size: 16px;
  font-family: Muli;
}
.div__platemap-createapply-button-background-enabled:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}
.div__platemap-select-dropdown-container {
  position: relative;
  height: 60px;
  width: 300px;
  z-index: 5;
}
</style>
