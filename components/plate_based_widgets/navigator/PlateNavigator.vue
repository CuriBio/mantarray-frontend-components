<template>
  <div class="div__plate-navigator">
    <div class="div__plate-navigator-tab-container">
      <div
        v-for="(tab, i) in ['Plate Map View', 'Stim. Plate View']"
        :id="i"
        :key="tab"
        :class="i === active_tab ? 'div__plate-navigator-active-tab' : 'div__plate-navigator-inactive-tab'"
        @click="set_active_tab"
      >
        {{ tab }}
      </div>

      <!-- <div :class="div__plate - navigator - active - tab">Stim. Plate View</div>
      <div :class="div__plate - navigator - inactive - tab">Plate Map View</div> -->
    </div>
    <div class="div__plate-navigator-plate-body">
      <!-- original MockFlow ID: cmpD6ca2d9ba3a0cec7efa1b41c0ae833e9c -->
      <span
        v-for="well_index in Array(24).keys()"
        :id="'well_span_' + well_index"
        :key="well_index"
        width="45px"
        height="45px"
        :style="
          'position: absolute; top: ' +
          (12 + (well_index % 4) * 37.153) +
          'px; left: ' +
          (15 + Math.floor(well_index / 4) * 38.0844) +
          'px; z-index: 76;'
        "
      >
        <svg height="40" width="40">
          <circle
            :id="'well_' + well_index"
            cx="17"
            cy="17"
            r="15"
            stroke="#FFFFFF"
            stroke-width="0"
            :fill="get_well_colors[well_index]"
            :class="{
              'circle__plate-navigator-well--selected': selected_quadrant_well_indices.includes(well_index),
              'circle__plate-navigator-well--unselected-hover':
                !selected_quadrant_well_indices.includes(well_index) &&
                hovered_quadrant_wells.includes(well_index),
            }"
            @click="on_click_well(well_index)"
            @mouseenter="on_enter_well(well_index)"
            @mouseleave="on_leave_well(well_index)"
          />
        </svg>
      </span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

/**
 * @vue-data {Array} hovered_quadrant_wells - Current quadrant array
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-computed {Array} selected_quadrant_well_indices - Current quadrant indices in Vuex store
 * @vue-event {Event} on_enter_well - User entered well plate
 * @vue-event {Event} on_leave_well - User leave well plate
 * @vue-event {Event} on_click_well - User selects a well or quadrant
 */
export default {
  name: "PlateNavigator",
  data: function () {
    return {
      hovered_quadrant_wells: [],
      active_tab: 0,
      quadrant_options: {
        QUADRANT_ONE: [0, 1, 4, 5, 8, 9],
        QUADRANT_TWO: [12, 13, 16, 17, 20, 21],
        QUADRANT_THREE: [2, 3, 6, 7, 10, 11],
        QUADRANT_FOUR: [14, 15, 18, 19, 22, 23],
      },
    };
  },
  computed: {
    ...mapState("twentyfourcontrols", {
      selected_quadrant_well_indices: "is_quadrant",
    }),
    ...mapState("stimulation", ["protocol_assignments"]),
    ...mapState("platemap", ["well_assignments", "current_platemap_name", "stored_platemaps"]),
    platemap_colors: function () {
      // want to use most recently saved state for selected platemap to only reflect changes after 'Save Changes' is selected and not as labels are applied before saving
      const saved_platemap = this.stored_platemaps.find(
        ({ map_name }) => map_name === this.current_platemap_name
      );
      return Array(24)
        .fill("#b7b7b7")
        .map((gray, i) => {
          let color_to_use = gray;
          // don't change the platemap navigator colors until a user has saved a platemap so that it's obvious when the labels have been assigned
          if (this.is_platemap_selected) {
            for (const { wells, color } of saved_platemap.labels) {
              if (wells.includes(i)) color_to_use = color;
            }
          }
          return color_to_use;
        });
    },
    stim_plate_colors: function () {
      return Array(24)
        .fill("#b7b7b7")
        .map((gray, i) =>
          this.protocol_assignments[i] !== undefined ? this.protocol_assignments[i].color : gray
        );
    },
    get_well_colors: function () {
      return this.active_tab === 0 ? this.platemap_colors : this.stim_plate_colors;
    },
    is_platemap_selected: function () {
      return this.current_platemap_name && this.current_platemap_name.length > 0;
    },
  },
  methods: {
    get_quadrant_from_well_index: function (well_index) {
      for (const wells of Object.values(this.quadrant_options)) {
        if (wells && wells.includes(well_index)) return wells;
      }
    },
    on_enter_well: function (well_index) {
      this.hovered_quadrant_wells = this.get_quadrant_from_well_index(well_index);
    },
    on_leave_well: function () {
      this.hovered_quadrant_wells = [];
    },
    on_click_well: function (well_index) {
      const quadrant_containing_this_well = this.get_quadrant_from_well_index(well_index);
      this.$store.commit("twentyfourcontrols/set_is_quadrant", quadrant_containing_this_well);
    },
    set_active_tab({ target }) {
      this.active_tab = Number(target.id);
    },
  },
};
</script>
<style>
body {
  user-select: none;
}

.div__plate-navigator {
  position: relative;
  top: 0px;
  left: 0px;
  width: 287px;
  height: 212px;
  background: #1c1c1c;
  margin-bottom: 8px;
}
.div__plate-navigator-tab-container {
  position: relative;
  width: 99%;
  height: 35px;
  display: flex;
  flex-direction: row;
}
.div__plate-navigator-active-tab {
  position: relative;
  width: 50%;
  height: 100%;
  color: #b7b7b7;
  cursor: pointer;
  font-family: Muli;
  text-align: center;
  line-height: 3;
  font-size: 13px;
}
.div__plate-navigator-inactive-tab {
  position: relative;
  width: 50%;
  height: 100%;
  background: rgb(0, 0, 0);
  color: #b7b7b7c9;
  cursor: pointer;
  font-family: Muli;
  text-align: center;
  line-height: 3;
  font-size: 13px;
}

.div__plate-navigator-plate-body {
  position: absolute;
  bottom: 5px;
  left: 17px;
  width: 254px;
  height: 167px;
  background: #000000;

  box-sizing: border-box;
  padding: 0px;
  margin: 0px;

  border: 0px none rgb(0, 0, 0);
  border-radius: 5px;
  box-shadow: rgb(0, 0, 0) 0px 0px 5px 0px;
}

.circle__plate-navigator-well--selected {
  stroke-width: 2;
}

.circle__plate-navigator-well--unselected-hover {
  stroke-width: 2;
  stroke: #ececed;
}
</style>
