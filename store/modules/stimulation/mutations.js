export default {
  handle_selected_wells(state, wells) {
    const well_values = [];
    wells.filter((well, idx) => {
      if (well === true) well_values.push(idx);
    });
    state.selected_wells = well_values;
  },
  apply_selected_protocol(state, idx) {
    state.selected_wells.map((well) => (state.protocol_assignments[well] = state.protocol_list[idx]));
  },
  clear_selected_protocol(state) {
    state.selected_wells.map((well) => delete state.protocol_assignments[well]);
  },
};
