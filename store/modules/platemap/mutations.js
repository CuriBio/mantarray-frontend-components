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
        for (const well of state.selected_wells) {
          if (!state.well_assignments[idx].wells.includes(well)) state.well_assignments[idx].wells.push(well);
        }
      }
    }

    // reset selected wells
    state.selected_wells = [];
  },
  clear_selected_wells(state, assignment_option) {
    const selected_assigment_idx = JSON.parse(JSON.stringify(state.well_assignments)).findIndex(
      ({ name }) => name === assignment_option
    );
    state.well_assignments[selected_assigment_idx].wells = state.well_assignments[
      selected_assigment_idx
    ].wells.filter((well_idx) => !state.selected_wells.includes(well_idx));
    // reset selected wells
    state.selected_wells = [];
  },
  clear_all_well_assignments(state) {
    for (const well of state.well_assignments) {
      well.wells = [];
    }
  },
  set_entire_platemap(state, labels) {
    state.well_assignments = [...labels];
  },
  set_platemap_name(state, input) {
    state.current_platemap_name = input;
  },
  change_existing_name(state, { old_name, new_name }) {
    const index_to_change = state.well_assignments.findIndex(({ name }) => name === old_name);
    state.well_assignments[index_to_change].name = new_name;
  },
  save_new_platemap(state, platemap) {
    state.stored_platemaps.push(platemap);
    state.current_platemap_name = platemap.map_name;
  },
  save_platemap_changes(state, { platemap, previous_name }) {
    const selected_idx = state.stored_platemaps.findIndex(
      (map) => map.map_name === platemap.map_name || map.map_name === previous_name
    );

    state.stored_platemaps[selected_idx].labels = platemap.labels;
    state.stored_platemaps[selected_idx].map_name = platemap.map_name;
  },
};
