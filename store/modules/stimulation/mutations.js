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
  handle_stimulation_type(state, type) {
    state.new_protocol.stimulation_type = type;
  },
  handle_stop_requirement(state, input) {
    state.new_protocol.stop_requirement = input;
  },
  handle_time_input(state, input) {
    state.new_protocol.frequency = input;
  },
  handle_time_unit(state, unit) {
    state.new_protocol.time_unit = unit;
  },
  handle_protocol_name(state, name) {
    state.new_protocol.name = name;
  },
};
