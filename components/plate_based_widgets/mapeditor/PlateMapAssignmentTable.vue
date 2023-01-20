<template>
  <div class="div__platemap-assignmenttable-outer-backdrop">
    <div class="div__platemap-assignmenttable-backdrop">
      <div class="b-table__background-container">
        <table>
          <thead>
            <tr :class="'b-table__th-class'">
              <th scope="col">Label</th>
              <th scope="col">Wells</th>
              <th scope="col">Color</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in well_label_assignments"
              :key="assignment.name"
              :class="'b-table__td-class'"
            >
              <td scope="row">{{ assignment.name }}</td>
              <td>
                {{ assignment.wells.map((well) => well_names[well]).join(", ") }}
              </td>
              <td class="div__color-table-cell">
                <div class="div__color-block-container" :style="`background: ${assignment.color}`" />
              </td>
              <td>
                <FontAwesomeIcon
                  class="fontawesome__trash-icon"
                  :icon="['fa', 'trash-alt']"
                  @click="() => handle_deletion(assignment.name)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrashAlt);

export default {
  name: "PlateMapAssignmentTable",
  components: { FontAwesomeIcon },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("platemap", ["well_assignments"]),
    well_label_assignments: function () {
      return this.well_assignments.filter(({ wells }) => wells.length > 0);
    },
    well_names: function () {
      return [...Array(24).keys()].map((i) =>
        twenty_four_well_plate_definition.get_well_name_from_well_index(i)
      );
    },
  },
  methods: {
    ...mapActions("platemap", ["remove_selected_well_assignment"]),
    handle_deletion: function (name) {
      this.remove_selected_well_assignment(name);
    },
  },
};
</script>
<style scoped>
.div__platemap-assignmenttable-outer-backdrop {
  width: 870px;
  height: 252px;
  background: rgb(17, 17, 17);
  display: flex;
}
.div__platemap-assignmenttable-backdrop {
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
  width: 30%;
  max-width: 30%;
}
.fontawesome__trash-icon {
  color: #b7b7b7;
  padding-top: 1px;
  font-size: 20px;
  position: relative;
}

.fontawesome__trash-icon:hover {
  cursor: pointer;
  color: #b7b7b7c9;
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
  height: 100%;
  position: relative;
  padding-left: 12%;
}
</style>
