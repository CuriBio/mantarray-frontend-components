<template>
  <div class="div__plate-navigator">
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
            fill="#b7b7b7"
            :class="{
              'circle__plate-navigator-well--selected': selected_quadrant_well_indices.includes(
                well_index
              ),
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
    };
  },
  computed: {
    ...mapState("twentyfourcontrols", {
      selected_quadrant_well_indices: "is_quadrant",
    }),
  },
  created() {
    this.quadrant_options = {
      QUADRANT_ONE: [0, 1, 4, 5, 8, 9],
      QUADRANT_TWO: [12, 13, 16, 17, 20, 21],
      QUADRANT_THREE: [2, 3, 6, 7, 10, 11],
      QUADRANT_FOUR: [14, 15, 18, 19, 22, 23],
    };

    this.quadrant_options_api_set = {
      QUADRANT: "twentyfourcontrols/set_is_quadrant",
    };
    this.quadrant_options_api_get = {
      QUADRANT: "twentyfourcontrols/is_quadrant",
    };
  },
  methods: {
    get_quadrant_from_well_index: function (well_index) {
      switch (well_index) {
        case 0:
        case 1:
        case 4:
        case 5:
        case 8:
        case 9: {
          return this.quadrant_options.QUADRANT_ONE;
        }
        case 12:
        case 13:
        case 16:
        case 17:
        case 20:
        case 21: {
          return this.quadrant_options.QUADRANT_TWO;
        }

        case 2:
        case 3:
        case 6:
        case 7:
        case 10:
        case 11: {
          return this.quadrant_options.QUADRANT_THREE;
        }
        case 14:
        case 15:
        case 18:
        case 19:
        case 22:
        case 23: {
          return this.quadrant_options.QUADRANT_FOUR;
        }
      }
    },

    on_enter_well: function (well_index) {
      this.hovered_quadrant_wells = this.get_quadrant_from_well_index(
        well_index
      );
    },
    on_leave_well: function (well_index) {
      this.hovered_quadrant_wells = [];
    },
    on_click_well: function (well_index) {
      const quadrant_containing_this_well = this.get_quadrant_from_well_index(
        well_index
      );
      this.$store.commit(
        this.quadrant_options_api_set.QUADRANT,
        quadrant_containing_this_well
      );
    },
  },
};
</script>
<style>
.div__plate-navigator {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 288px;
  height: 177px;
  background: #1c1c1c;
}

.div__plate-navigator-plate-body {
  position: absolute;
  top: 5px;
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
