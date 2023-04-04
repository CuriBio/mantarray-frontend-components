// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { COLOR_PALETTE } from "@/store/modules/stimulation/enums";

export default {
  set_new_label(state, name) {
    const color_idx = state.well_assignments.length - 1;
    // has to be a copy to maintain independent state
    const new_label = { name, wells: [], color: COLOR_PALETTE.reverse()[color_idx] };
    // add label to all other platemaps
    state.stored_platemaps.map(({ labels }) => labels.push(JSON.parse(JSON.stringify(new_label))));
    state.well_assignments.push(JSON.parse(JSON.stringify(new_label)));
  },
  set_selected_wells(state, wells) {
    state.selected_wells = [...wells];
  },
  apply_well_assignment(state, assignment_option) {
    for (const group of state.well_assignments) {
      const idx = state.well_assignments.indexOf(group);
      const assignments = state.well_assignments[idx];
      // if it's the selected label, then add well to assignment array
      if (group.name === assignment_option) {
        // json parse to copy and be independent of state selected wells
        for (const well of state.selected_wells) {
          if (!assignments.wells.includes(well)) assignments.wells.push(well);
        }
      } else {
        // else if this well was previously assigned a different label, then remove well from assignment array
        for (const well of state.selected_wells) {
          const duplicate_assignment_idx = assignments.wells.indexOf(well);
          if (duplicate_assignment_idx !== -1) assignments.wells.splice(duplicate_assignment_idx, 1);
        }
      }
    }

    // reset selected wells
    state.selected_wells = [];
  },
  clear_selected_wells(state) {
    state.well_assignments.map((label) => {
      if (label && label.wells) {
        label.wells = label.wells.filter((well_idx) => !state.selected_wells.includes(well_idx));
      }
    });

    // reset selected wells
    state.selected_wells = [];
  },
  clear_platemap(state) {
    const platemaps_copy = JSON.parse(JSON.stringify(state.stored_platemaps));
    state.well_assignments = JSON.parse(JSON.stringify([{ name: "Select Label", wells: [], color: "none" }]));
    // get the index of the current platemap to remove
    const platemap_idx_to_clear = platemaps_copy
      .map(({ map_name }) => map_name)
      .indexOf(state.current_platemap_name);

    platemaps_copy.splice(platemap_idx_to_clear, 1);
    state.stored_platemaps = platemaps_copy;
    state.current_platemap_name = null;
    // reset selected wells
    state.selected_wells = [];
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
    // also change in existing platemaps

    state.stored_platemaps.map(({ labels }) => {
      labels[index_to_change].name = new_name;
    });
  },
  save_new_platemap(state, platemap) {
    state.current_platemap_name = platemap.map_name;
    state.stored_platemaps.push(platemap);
  },
  save_platemap_changes(state, { platemap, previous_name }) {
    const selected_idx = state.stored_platemaps.findIndex(
      (map) => map.map_name === platemap.map_name || map.map_name === previous_name
    );

    state.stored_platemaps[selected_idx].labels = platemap.labels;
    state.stored_platemaps[selected_idx].map_name = platemap.map_name;
  },
  clear_all_well_assignments(state) {
    for (const well of state.well_assignments) {
      well.wells = [];
    }
  },
};
