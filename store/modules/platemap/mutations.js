// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { COLOR_PALETTE } from "@/store/modules/stimulation/enums";

export default {
  set_new_well_assignment(state, name) {
    const color_idx = state.well_assignments.length === 1 ? 0 : state.well_assignments.length;
    state.well_assignments.push({ name, wells: [], color: COLOR_PALETTE.reverse()[color_idx] });
  },
  set_selected_wells(state, wells) {
    state.selected_wells = [...wells];
  },
  apply_well_assignment(state, assignment_option) {
    for (const well of state.well_assignments) {
      if (well.name === assignment_option) {
        const idx = state.well_assignments.indexOf(well);
        // json parse to copy and be independent of state selected wells
        state.well_assignments[idx].wells = [...JSON.parse(JSON.stringify(state.selected_wells))];
      }
    }

    // reset selected wells
    state.selected_wells = [];
  },
  clear_well_assignments(state) {
    for (const well of state.well_assignments) {
      well.wells = [];
    }
  },
  set_entire_platemap(state, map) {
    state.well_assignments = [...map];
  },
  set_platemap_name(state, input) {
    state.current_platemap_name = input;
  },
  save_new_platemap(state, platemap) {
    state.stored_platemaps.push(platemap);
    state.current_platemap_name = platemap.name;
  },
  save_platemap_changes(state, { platemap, previous_name }) {
    const selected_idx = state.stored_platemaps.findIndex(
      (map) => map.name === platemap.name || map.name === previous_name
    );

    state.stored_platemaps[selected_idx].map = platemap.map;
    state.stored_platemaps[selected_idx].name = platemap.name;
  },
};
