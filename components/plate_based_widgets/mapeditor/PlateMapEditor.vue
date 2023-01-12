<template>
  <div class="div__platemapeditor-layout-background">
    <div class="div__platemapeditor-header">Plate Map Editor</div>
    <canvas class="canvas__common-horizontal-line" />
    <div class="div__platemap-treatmenttable-container">
      <div class="div__platemapeditor-subheader">Applied Treatment(s)</div>
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

    <div class="div__platemap-buttons-container">
      <div
        v-for="(value, idx) in ['Save Changes', 'Reset All Treatments', 'Discard Changes']"
        :id="idx"
        :key="value"
        class="div__platemap-button-background"
        @click.exact="handle_click"
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
import PlateMap from "@/components/plate_based_widgets/mapeditor/PlateMap.vue";
import PlateMapCreateApply from "@/components/plate_based_widgets/mapeditor/PlateMapCreateApply.vue";
import PlateMapTreatmentTable from "@/components/plate_based_widgets/mapeditor/PlateMapTreatmentTable.vue";
import NewTreatmentWidget from "@/components/plate_based_widgets/mapeditor/NewTreatmentWidget.vue";
import { BModal } from "bootstrap-vue";
import { mapState } from "vuex";
Vue.component("BModal", BModal);

export default {
  name: "PlateMapEditor",
  components: {
    PlateMap,
    PlateMapCreateApply,
    PlateMapTreatmentTable,
    NewTreatmentWidget,
    BModal,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("platemap", ["well_treatments", "selected_wells"]),
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
  },

  methods: {
    display_event(value) {
      this.userevent = value;
    },
    handle_modal_open: function () {
      this.$bvModal.show("new-treatment-modal");
    },
    handle_modal_close: function (idx) {
      this.$bvModal.hide("new-treatment-modal");
    },
    platewell_selected: function (wells) {
      // set indices of wells with true values marking selected
      this.$store.commit(
        "platemap/set_selected_wells",
        wells
          .map((b, i) => {
            return b ? i : b;
          })
          .filter((well) => well || well === 0)
      );
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
  top: 60px;
  position: absolute;
}
.div__platemapeditor-container {
  position: absolute;
  top: 162px;
  left: 367px;
}
.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  height: 2px;
  top: 120px;
  left: 400px;
  width: 850px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.div__platemap-createselect-container {
  position: absolute;
  top: 162px;
  left: 420px;
}
.div__platemap-buttons-container {
  position: absolute;
  bottom: 40px;
  width: 1629px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.div__platemap-button-background {
  background: #b7b7b7;
  height: 50px;
  line-height: 2.5;
  position: relative;
  width: 205px;
  margin: 15px;
  text-align: center;
  font-size: 18px;
  font-family: Muli;
}

.div__platemap-button-background:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}
.div__platemap-treatmenttable-container {
  position: absolute;
  height: 300px;
  top: 470px;
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
  text-align: center;
  height: 30px;
  position: relative;
  margin-bottom: 10px;
}
.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

#new-treatment-modal {
  position: fixed;
  margin: 5% auto;
  top: 25%;
  left: 0;
  right: 0;
}
</style>
