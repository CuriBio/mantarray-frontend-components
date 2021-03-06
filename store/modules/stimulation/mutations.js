export default {
  set_selected_wells(state, wells) {
    state.selected_wells = wells;
  },
  apply_selected_protocol(state, protocol) {
    state.selected_wells.map((well) => {
      state.protocol_assignments[well] = protocol;
    });
  },
  clear_selected_protocol(state) {
    state.selected_wells.map((well) => delete state.protocol_assignments[well]);
  },
  set_protocol_name({ protocol_editor }, name) {
    protocol_editor.name = name;
  },
  set_stimulation_type({ protocol_editor }, type) {
    if (type[0] === "C") protocol_editor.stimulation_type = "C";
    if (type[0] === "V") protocol_editor.stimulation_type = "V";
  },
  set_time_unit({ protocol_editor }, unit) {
    protocol_editor.time_unit = unit;
  },
  set_pulses({ protocol_editor }, { pulses, new_pulse_order }) {
    protocol_editor.pulses = pulses;
    protocol_editor.detailed_pulses = new_pulse_order;
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
  reset_protocol_editor(state) {
    const replace_state = {
      ...state,
      protocol_editor: {
        name: "",
        stimulation_type: "V",
        stop_requirement: "Until Stopped",
        end_delay_duration: 0,
        time_unit: "seconds",
        pulses: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
      x_axis_scale: 100,
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
      protocol_editor: {
        name: "",
        stimulation_type: "V",
        stop_requirement: "Until Stopped",
        end_delay_duration: 0,
        time_unit: "seconds",
        pulses: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
      x_axis_scale: 100,
      y_axis_scale: 10,
      delay_blocks: [],
    };
    Object.assign(state, replace_state);
  },
  set_repeat_frequency({ protocol_editor }, time) {
    protocol_editor.end_delay_duration = Number(time);
  },
  set_delay_axis_values(state, delay) {
    const { end_delay_duration, pulses } = state.protocol_editor;
    const delay_pulse_model = {
      phase_one_duration: end_delay_duration,
      phase_one_charge: 0,
      interpulse_duration: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    };
    state.delay_blocks = [delay];
    pulses.push(delay_pulse_model);
  },
  set_imported_protocol({ protocol_list }, protocol) {
    protocol_list.push(protocol);
  },
  set_stim_status(state, bool) {
    state.stim_status = bool;
  },
  set_edit_mode({ edit_mode }, { label, letter }) {
    edit_mode.status = true;
    edit_mode.label = label;
    edit_mode.letter = letter;
  },
  set_edit_mode_off({ edit_mode }) {
    edit_mode.status = false;
  },
};
