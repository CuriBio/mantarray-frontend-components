<template>
  <div class="div__platemapeditor-layout-background">
    <div class="div__platemapeditor-header">Plate Map Editor</div>
    <canvas class="canvas__common-horizontal-line" />
    <div class="div__platemapeditor-container">
      <PlateMap :platecolor="passing_plate_colors" @test-event="display_event" />
      <PlateMapCreateApply />
    </div>
    <div class="div__platemap-treatmenttable-container">
      <div class="div__platemapeditor-subheader">Selected Treatment(s)</div>
      <PlateMapTreatmentTable />
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
  </div>
</template>

<script>
import PlateMap from "@/components/plate_based_widgets/mapeditor/PlateMap.vue";
import PlateMapCreateApply from "@/components/plate_based_widgets/mapeditor/PlateMapCreateApply.vue";
import PlateMapTreatmentTable from "@/components/plate_based_widgets/mapeditor/PlateMapTreatmentTable.vue";

export default {
  name: "PlateMapEditor",
  components: {
    PlateMap,
    PlateMapCreateApply,
    PlateMapTreatmentTable,
  },
  data() {
    return {
      userevent: "",
    };
  },
  created: function () {
    const plate_colors = [
      "#871d28",
      "#bd3532",
      "#df6147",
      "#f0a061",
      "#871d28",
      "#bd3532",
      "#df6147",
      "#f0a061",
      "#83c0b3",
      "#83c0b3",
      "#83c0b3",
      "#f9d78c",
      "#45847b",
      "#45847b",
      "#45847b",
      "#f9d78c",
      "#24524b",
      "#24524b",
      "#24524b",
      "#24524b",
      "#133836",
      "#133836",
      "#133836",
      "#133836",
    ];
    this.passing_plate_colors = plate_colors;
  },
  methods: {
    display_event(value) {
      this.userevent = value;
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
}
</style>
