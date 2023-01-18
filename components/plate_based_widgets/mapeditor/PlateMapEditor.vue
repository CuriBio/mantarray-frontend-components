<template>
  <div class="div__platemapeditor-layout-background">
    <div class="div__platemapeditor-header">Plate Map Editor</div>
    <canvas class="canvas__common-horizontal-line" />
    <div class="div__platemap-treatmenttable-container">
      <div class="div__platemapeditor-subheader">
        <div class="div__platemap-name-container">
          Platemap Name:
          <div class="div__platemap-input-container">
            <InputWidget
              :placeholder="'Platemap A'"
              :input_width="200"
              :input_height="28"
              :invalid_text="invalid_text"
              :initial_value="input_platemap_name"
              :dom_id_suffix="'platemap-name'"
              @update:value="update_platemap_input"
            />
          </div>
        </div>
      </div>
      <PlateMapTreatmentTable />
    </div>
    <div class="div__platemapeditor-container">
      <PlateMap
        :platecolor="passing_plate_colors"
        :selected="well_selection"
        @platewell-selected="platewell_selected"
      />
      <PlateMapCreateApply @handle_modal_open="handle_modal_open" />
    </div>
    <div class="div__platemap-upper-buttons-container">
      <div
        v-for="(value, idx) in ['Import Map', 'Export Map']"
        :id="idx"
        :key="value"
        :class="
          is_export_import_enabled[idx]
            ? 'div__platemap-button-background-enabled'
            : 'div__platemap-button-background-disabled'
        "
        @click.exact="handle_import_export"
      >
        {{ value }}
      </div>
      <input ref="file" type="file" style="display: none" @change="handle_import($event.target.files)" />
    </div>
    <div class="div__platemap-lower-buttons-container">
      <div
        v-for="(value, idx) in ['Save Changes', 'Clear/Reset All', 'Discard All Changes']"
        :id="idx"
        :key="value"
        class="div__platemap-button-background-enabled"
        @click.exact="handle_btn_click"
      >
        {{ value }}
      </div>
    </div>
    <b-modal
      id="new-treatment-modal"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <NewTreatmentWidget id="new-treatment-widget" @close_modal="handle_modal_close" />
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import PlateMap from "@/components/plate_based_widgets/mapeditor/PlateMap.vue";
import PlateMapCreateApply from "@/components/plate_based_widgets/mapeditor/PlateMapCreateApply.vue";
import PlateMapTreatmentTable from "@/components/plate_based_widgets/mapeditor/PlateMapTreatmentTable.vue";
import NewTreatmentWidget from "@/components/plate_based_widgets/mapeditor/NewTreatmentWidget.vue";
import { BModal } from "bootstrap-vue";
import { mapState, mapActions, mapMutations } from "vuex";
Vue.component("BModal", BModal);

export default {
  name: "PlateMapEditor",
  components: {
    PlateMap,
    PlateMapCreateApply,
    PlateMapTreatmentTable,
    NewTreatmentWidget,
    InputWidget,
    BModal,
  },
  data() {
    return {
      invalid_text: "Required",
      input_platemap_name: "",
    };
  },
  computed: {
    ...mapState("platemap", ["well_treatments", "selected_wells", "current_platemap_name"]),
    passing_plate_colors: function () {
      const blank_plate = Array(24).fill("#b7b7b7");

      const arr = blank_plate.map((gray, i) => {
        let color_to_use = gray;
        for (const { wells, color } of this.well_treatments) {
          if (wells.includes(i)) color_to_use = color;
        }
        return color_to_use;
      });
      return arr;
    },
    well_selection: function () {
      return Array(24)
        .fill()
        .map((_, i) => {
          return this.selected_wells.includes(i);
        });
    },
    are_wells_assigned: function () {
      // if no wells are assigned, the wells array for each treatment will be empty
      return this.well_treatments.filter(({ wells }) => wells.length > 0).length > 0;
    },
    is_export_import_enabled: function () {
      // only allow export if wells have been assigned
      return [true, this.are_wells_assigned];
    },
  },
  watch: {
    current_platemap_name: function () {
      this.input_platemap_name = this.current_platemap_name;
    },
  },
  methods: {
    ...mapActions("platemap", [
      "handle_import_platemap",
      "handle_export_platemap",
      "save_platemap",
      "discard_current_platemap_changes",
    ]),
    ...mapMutations("platemap", ["set_selected_wells", "clear_well_treatments", "set_platemap_name"]),
    display_event(value) {
      this.userevent = value;
    },
    handle_modal_open: function () {
      this.$bvModal.show("new-treatment-modal");
    },
    handle_modal_close: function () {
      this.$bvModal.hide("new-treatment-modal");
    },
    platewell_selected: function (wells) {
      // set indices of wells with true values marking selected
      this.set_selected_wells(
        wells
          .map((b, i) => {
            return b ? i : b;
          })
          .filter((well) => well || well === 0)
      );
    },
    handle_btn_click: function ({ target }) {
      const button_idx = Number(target.id);
      if (button_idx === 0 && this.invalid_text === "") {
        // saving name on save instead of here as it's input to trigger dropdown change in other component
        this.save_platemap(this.input_platemap_name);
      } else if (button_idx === 1) {
        this.clear_well_treatments();
      } else if (button_idx === 2) {
        this.discard_current_platemap_changes();
        this.input_platemap_name = this.current_platemap_name;
      }
    },
    handle_import_export: function ({ target }) {
      const button_idx = Number(target.id);

      if (this.is_export_import_enabled[button_idx]) {
        if (button_idx === 0) {
          // manually click file ref to open local directory for file selection
          this.$refs.file.click();
        } else this.handle_export_platemap(this.input_platemap_name);
      }
    },
    handle_import: async function (files) {
      for (const file of files) {
        await this.handle_import_platemap(file);
      }
    },
    update_platemap_input: function (value) {
      this.input_platemap_name = value;
      // even though this isn't shown, it signifies whether a red or green border is used around the input box
      this.invalid_text = value.length === 0 ? "Required" : "";
    },
  },
};
</script>
<style scoped>
.div__platemapeditor-layout-background {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 1629px;
  height: 885px;
}
.div__platemapeditor-header {
  color: #ffffff;
  font-size: 25px;
  font-family: Muli;
  width: 1629px;
  text-align: center;
  height: 45px;
  top: 20px;
  position: absolute;
}
.div__platemapeditor-container {
  position: absolute;
  top: 115px;
  left: 367px;
}
.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  height: 2px;
  top: 80px;
  left: 400px;
  width: 850px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.div__platemap-lower-buttons-container {
  position: absolute;
  bottom: 30px;
  width: 1629px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.div__platemap-upper-buttons-container {
  position: absolute;
  bottom: 95px;
  width: 1629px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.div__platemap-button-background-enabled {
  background: #b7b7b7;
  height: 50px;
  line-height: 2.5;
  position: relative;
  width: 200px;
  margin: 15px;
  text-align: center;
  font-size: 18px;
  font-family: Muli;
}
.div__platemap-button-background-disabled {
  background: #b7b7b7c9;
  height: 50px;
  line-height: 2.5;
  position: relative;
  width: 200px;
  margin: 15px;
  text-align: center;
  font-size: 18px;
  font-family: Muli;
  color: #636262;
}
.div__platemap-button-background-enabled:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}
.div__platemap-treatmenttable-container {
  position: absolute;
  height: 300px;
  top: 415px;
  width: 1629px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.div__platemapeditor-subheader {
  color: #b7b7b7;
  font-size: 19px;
  font-family: Muli;
  width: 1629px;
  text-align: left;
  height: 43px;
  position: relative;
  line-height: 2;
  margin-bottom: 2px;
  width: 53%;
}
.div__platemap-name-container {
  background: rgb(17, 17, 17);
  flex-direction: row;
  display: flex;
  position: relative;
  width: 50%;
  height: 100%;
  padding-left: 30px;
}
.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}
.div__platemap-input-container {
  position: relative;
  margin-left: 10px;
  margin-top: 5px;
  width: 204px;
  height: 33px;
  overflow: hidden;
}
</style>
