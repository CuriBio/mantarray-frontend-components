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
  handle_delete_protocol(state) {
    state.delete_protocol = true;
  },
  handle_stimulation_type(state, type) {
    state.new_protocol.stimulation_type = type;
  },
  handle_time_unit(state, unit) {
    state.new_protocol.time_unit = unit;
  },
  handle_protocol_order(state, array) {
    state.new_protocol.waveform_list = array;
    const x_values = [0, 1000]; // one second delay to start
    const y_values = [0, 0];

    for (let i = 0; i < array.length; i++) {
      const setting = array[i].settings;
      x_values.push(
        x_values[x_values.length - 1],
        setting.phase_one_duration + x_values[x_values.length - 1]
      );
      y_values.push(setting.phase_one_charge, setting.phase_one_charge);
      if (setting.interpulse_duration) {
        x_values.push(
          x_values[x_values.length - 1],
          setting.interpulse_duration + x_values[x_values.length - 1]
        );
        y_values.push(0, 0);
      }
      if (setting.phase_two_duration) {
        x_values.push(
          x_values[x_values.length - 1],
          setting.phase_two_duration + x_values[x_values.length - 1]
        );
        y_values.push(setting.phase_two_charge, setting.phase_two_charge);
      }
    }
    state.x_axis_points = x_values;
    state.y_axis_points = y_values;
  },
};
