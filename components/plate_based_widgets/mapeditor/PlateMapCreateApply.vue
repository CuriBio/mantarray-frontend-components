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
    <div class="div__platemap-createapply-subheader">Well Treatments</div>
    <div class="div__platemap-select-dropdown-container">
      <SelectDropDown
        :options_text="well_treatment_names"
        :input_width="300"
        :input_height="45"
        :options_idx="treatment_options_idx"
        @selection-changed="handle_well_dropdown_selection"
      />
    </div>
    <div class="div__platemap-createapply-buttons-container">
      <div
        v-for="(value, idx) in ['Apply Treatment', 'Create Treatment']"
        :id="idx"
        :key="value"
        :class="
          // apply button is only button that could be disabled
          idx === 0 && !is_apply_enabled
            ? 'div__platemap-createapply-button-background-disabled'
            : 'div__platemap-createapply-button-background-enabled'
        "
        @click.exact="handle_click"
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
      treatment_option: null,
      treatment_options_idx: 0,
      map_options_idx: 0,
    };
  },
  computed: {
    ...mapState("platemap", [
      "well_treatments",
      "selected_wells",
      "stored_platemaps",
      "current_platemap_name",
    ]),
    well_treatment_names: function () {
      return this.well_treatments.map(({ name }) => name);
    },
    platemap_names: function () {
      return this.stored_platemaps.map(({ name }) => name);
    },
    is_apply_enabled: function () {
      return this.selected_wells.length > 0 && this.treatment_options_idx !== 0;
    },
  },
  watch: {
    current_platemap_name: function () {
      if (this.current_platemap_name !== this.platemap_names[this.map_options_idx]) {
        const platemap_idx = this.platemap_names.indexOf(this.current_platemap_name);
        this.map_options_idx = this.current_platemap_name.length > 0 && platemap_idx > -1 ? platemap_idx : 0;
      }
    },
    well_treatment_names: function (new_names, old_names) {
      // select new treatment once saved to be selected in dropdown
      if (new_names.length > old_names.length) {
        this.handle_well_dropdown_selection(new_names.length - 1);
      }
    },
  },
  methods: {
    ...mapMutations("platemap", ["apply_well_treatment", "set_entire_platemap", "set_platemap_name"]),
    handle_click: function ({ target }) {
      if (target.id === "1") this.$emit("handle_modal_open");
      else {
        // prevent button from being clicked when it's disabled
        if (this.is_apply_enabled) this.apply_well_treatment(this.treatment_option);
      }
    },
    handle_well_dropdown_selection: function (idx) {
      this.treatment_option = this.well_treatment_names[idx];
      this.treatment_options_idx = idx;
    },
    handle_map_dropdown_selection: function (idx) {
      this.map_options_idx = idx;
      this.set_entire_platemap(this.stored_platemaps[idx].map);
      this.set_platemap_name(idx !== 0 ? this.stored_platemaps[idx].name : "");
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
  height: 280px;
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
