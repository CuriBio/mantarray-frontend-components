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
  handle_time_unit(state, unit) {
    state.new_protocol.time_unit = unit;
  },
  handle_protocol_order(state, array) {
    // TODO: clean up function, must be a more concise way of performing
    state.new_protocol.waveform_list = array;
    const x_values = [0];
    const y_values = [0];
    const color_assignments = {};
    const helper = (setting) => {
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
        x_values.push(
          x_values[x_values.length - 1],
          setting.phase_two_duration + x_values[x_values.length - 1]
        );
        y_values.push(setting.phase_two_charge, setting.phase_two_charge);
      }
    };
    for (let i = 0; i < array.length; i++) {
      // loop through current array of data inputs
      const number_of_repeats = array[i].repeat.number_of_repeats;
      const repeat_color = array[i].repeat.color;
      const starting_repeat_idx = x_values.length - 1; // keep track of color assignments
      const setting = array[i].settings;
      for (let k = 0; k <= number_of_repeats; k++) {
        // perform loop number of times requested in repeat block
        const nested_protocols = array[i].nested_protocols;
        helper(setting);
        if (nested_protocols.length > 0) {
          for (let j = 0; j < nested_protocols.length; j++) {
            // include all nested_protocols in repeat block
            const nested_setting = nested_protocols[j].settings;
            helper(nested_setting);
          }
        }
        const ending_repeat_idx = x_values.length; // keep track of color assignments
        if (nested_protocols.length > 0)
          color_assignments[repeat_color] = [starting_repeat_idx, ending_repeat_idx];
      }
    }
    state.x_axis_points = x_values;
    state.y_axis_points = y_values;
    state.repeat_colors = color_assignments;
  },
  handle_zoom_in(state, axis) {
    if (axis === "x-axis") state.x_axis_scale /= 10;
    if (axis === "y-axis") state.y_axis_scale /= 10;
  },
  handle_zoom_out(state, axis) {
    if (axis === "x-axis") state.x_axis_scale *= 10;
    if (axis === "y-axis") state.y_axis_scale *= 10;
  },
  reset_state(state) {
    const replace_state = {
      ...state,
      selected_wells: [],
      protocol_assignments: {},
      new_protocol: {
        name: "",
        stimulation_type: "Voltage Controlled Stimulation",
        stop_requirement: "Until Stopped",
        frequency: "",
        time_unit: "seconds",
        waveform_list: [],
      },
      delete_protocol: false,
      x_axis_points: [],
      y_axis_points: [],
      repeat_colors: {},
      x_axis_scale: 100000,
      y_axis_scale: 10,
    };
    Object.assign(state, replace_state);
  },
};
