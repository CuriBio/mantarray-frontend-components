export default {
  set_selected_wells(state, wells) {
    state.selected_wells = wells;
  },
  apply_selected_protocol(state, idx) {
    state.selected_wells.map((well) => (state.protocol_assignments[well] = state.protocol_list[idx]));
  },
  clear_selected_protocol(state) {
    state.selected_wells.map((well) => delete state.protocol_assignments[well]);
  },
  set_protocol_name(state, name) {
    state.new_protocol.name = name;
  },
  set_stimulation_type(state, type) {
    if (type.includes("Current")) state.new_protocol.stimulation_type = "C";
    if (type.includes("Voltage")) state.new_protocol.stimulation_type = "V";
  },
  set_time_unit(state, unit) {
    state.new_protocol.time_unit = unit;
  },
  set_waveform_order(state, array) {
    state.new_protocol.waveform_order = array;
    console.log(state.new_protocol.waveform_order);
  },
  set_axis_values(state, { x_values, y_values }) {
    state.x_axis_values = x_values;
    state.y_axis_values = y_values;
  },
  set_repeat_color_assignments(state, assignments) {
    state.repeat_colors = assignments;
  },
  set_zoom_in(state, axis) {
    if (axis === "x-axis") state.x_axis_scale /= 10;
    if (axis === "y-axis") state.y_axis_scale /= 10;
  },
  set_zoom_out(state, axis) {
    if (axis === "x-axis") state.x_axis_scale *= 10;
    if (axis === "y-axis") state.y_axis_scale *= 10;
  },
  reset_new_protocol(state) {
    const replace_state = {
      ...state,
      new_protocol: {
        name: "",
        stimulation_type: "V",
        stop_requirement: "Until Stopped",
        end_delay_duration: 0,
        time_unit: "seconds",
        waveform_order: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
      x_axis_scale: 10000,
      y_axis_scale: 10,
      delay_blocks: [],
    };
    Object.assign(state, replace_state);
  },
  reset_state(state) {
    const replace_state = {
      ...state,
      selected_wells: [],
      protocol_assignments: {},
      new_protocol: {
        name: "",
        stimulation_type: "V",
        stop_requirement: "Until Stopped",
        end_delay_duration: 0,
        time_unit: "seconds",
        waveform_order: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
      x_axis_scale: 10000,
      y_axis_scale: 10,
      delay_blocks: [],
    };
    Object.assign(state, replace_state);
  },
  set_repeat_frequency(state, time) {
    state.new_protocol.end_delay_duration = Number(time);
  },
  set_delay_axis_values(state, delay) {
    state.delay_blocks = [delay];
  },
  set_imported_protocol(state, protocol) {
    state.protocol_list.push(protocol);
  },
};
