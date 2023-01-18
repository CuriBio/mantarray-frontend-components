// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { COLOR_PALETTE } from "@/store/modules/stimulation/enums";

export default {
  set_new_well_treatment(state, name) {
    const color_idx = state.well_treatments.length === 1 ? 0 : state.well_treatments.length;
    state.well_treatments.push({ name, wells: [], color: COLOR_PALETTE.reverse()[color_idx] });
  },
  set_selected_wells(state, wells) {
    state.selected_wells = [...wells];
  },
  apply_well_treatment(state, treatment_option) {
    for (const well of state.well_treatments) {
      if (well.name === treatment_option) {
        const idx = state.well_treatments.indexOf(well);
        // json parse to copy and be independent of state selected wells
        state.well_treatments[idx].wells = [...JSON.parse(JSON.stringify(state.selected_wells))];
      }
    }

    // reset selected wells
    state.selected_wells = [];
  },
  clear_well_treatments(state) {
    for (const well of state.well_treatments) {
      well.wells = [];
    }
  },
  set_entire_platemap(state, map) {
    state.well_treatments = [...map];
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
