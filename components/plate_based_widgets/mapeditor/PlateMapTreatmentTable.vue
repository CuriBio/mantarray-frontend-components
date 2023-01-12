<template>
  <div class="div__platemap-treatmenttable-outer-backdrop">
    <div class="div__platemap-treatmenttable-backdrop">
      <div class="b-table__background-container">
        <table>
          <thead>
            <tr :class="'b-table__th-class'">
              <th scope="col">Name</th>
              <th scope="col">Wells</th>
              <th scope="col">Color</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assignment in assigned_treatments" :key="assignment.name" :class="'b-table__td-class'">
              <td scope="row">{{ assignment.name }}</td>
              <td>
                {{ assignment.wells.map((well) => well_names[well]).join(", ") }}
              </td>
              <td class="div__color-table-cell">
                <div class="div__color-block-container" :style="`background: ${assignment.color}`" />
                <div class="div__change-color-text">Change</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);

export default {
  name: "PlateMapTreatmentTable",
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("platemap", ["well_treatments"]),
    assigned_treatments: function () {
      return this.well_treatments.filter(({ wells }) => wells.length > 0);
    },
    well_names: function () {
      return [...Array(24).keys()].map((i) =>
        twenty_four_well_plate_definition.get_well_name_from_well_index(i)
      );
    },
  },

  methods: {},
};
</script>
<style scoped>
.div__platemap-treatmenttable-outer-backdrop {
  width: 870px;
  height: 252px;
  background: rgb(17, 17, 17);
  display: flex;
}
.div__platemap-treatmenttable-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  position: relative;
  height: 250px;
  max-height: 250px;
  visibility: visible;
  border: 0px none #1111;
  pointer-events: all;
  align-items: center;
  overflow-y: scroll;
  width: 870px;
}

.b-table__background-container {
  font-family: Muli;
  position: relative;
  background: #1111;
  text-align: center;
  height: 100%;
  width: 100%;
}
.b-table__th-class {
  font-size: 18px;
  background: black;
  color: #ffff;
  position: relative;
  border: 2px solid rgb(17, 17, 17);
  height: 45px;
  line-height: 3;
  margin: 0px;
}
.b-table__td-class {
  font-size: 16px;
  color: #b7b7b7;
  position: relative;
  background: rgb(17, 17, 17);
  line-height: 2.5;
  border-bottom: 1px solid #b7b7b7;
  width: 100%;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  height: 8px;
  overflow: visible;
}

::-webkit-scrollbar-thumb {
  background-color: #2f2f2f;
  overflow: visible;
}

::-webkit-scrollbar-track {
  background-color: #727171;
  overflow: visible;
}

table {
  width: 100%;
}
th {
  width: 33%;
  max-width: 33%;
}
td {
  max-width: 280px;
  overflow: hidden;
  max-height: 200px;
  padding: 0 12px;
}
.div__color-block-container {
  height: 30px;
  width: 50px;
  position: relative;
  margin-right: 10px;
}
.div__color-table-cell {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.div__change-color-text {
  font-size: 14px;
}
.div__change-color-text:hover {
  text-decoration: underline;
  font-style: italic;
  cursor: pointer;
}
</style>
