import { STIM_STATUS } from "./enums";

import { get_default_protocol_editor_state } from "./getters";

export default {
  set_selected_wells(state, wells) {
    state.selected_wells = wells;
  },
  apply_selected_protocol(state, protocol) {
    state.selected_wells.map((well) => {
      state.protocol_assignments[well] = protocol;
    });

    const previous_state = state.protocol_assignments;
    state.protocol_assignments = { ...state.protocol_assignments };

    if (Object.keys(previous_state) !== Object.keys(state.protocol_assignments))
      // checks if indices are different because this mutation gets called when existing assignments get edited
      state.stim_status = STIM_STATUS.CONFIG_CHECK_NEEDED;
  },
  clear_selected_protocol(state) {
    state.selected_wells.map((well) => delete state.protocol_assignments[well]);
    state.protocol_assignments = { ...state.protocol_assignments };

    if (Object.keys(state.protocol_assignments).length === 0)
      state.stim_status = STIM_STATUS.NO_PROTOCOLS_ASSIGNED;
  },
  set_protocol_name({ protocol_editor }, name) {
    protocol_editor.name = name;
  },
  set_stimulation_type({ protocol_editor }, type) {
    if (type[0] === "C") protocol_editor.stimulation_type = "C";
  },
  set_time_unit({ protocol_editor }, unit) {
    protocol_editor.time_unit = unit;
  },
  set_subprotocols({ protocol_editor }, { subprotocols, new_subprotocol_order }) {
    protocol_editor.subprotocols = subprotocols;
    protocol_editor.detailed_subprotocols = new_subprotocol_order;
  },
  set_axis_values(state, { x_values, y_values }) {
    state.x_axis_values = x_values;
    state.y_axis_values = y_values;
  },
  set_repeat_color_assignments(state, assignments) {
    state.repeat_colors = assignments;
  },
  set_zoom_in(state, axis) {
    if (axis === "y-axis") state.y_axis_scale /= 1.5;
  },
  set_zoom_out(state, axis) {
    if (axis === "y-axis") state.y_axis_scale *= 1.5;
  },
  reset_protocol_editor(state) {
    // Tanner (8/8/22): could probably use this mutation in reset_state to remove duplicate code
    const replace_state = {
      ...state,
      protocol_editor: get_default_protocol_editor_state(),
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: [],
      y_axis_scale: 120,
      delay_blocks: [],
      x_axis_time_idx: 0,
      edit_mode: { status: false, letter: "", label: "" },
    };
    Object.assign(state, replace_state);
  },
  reset_state(state) {
    const replace_state = {
      ...state,
      selected_wells: [],
      protocol_assignments: {},
      protocol_editor: get_default_protocol_editor_state(),
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: [],
      y_axis_scale: 120,
      delay_blocks: [],
      x_axis_time_idx: 0,
      stim_status: STIM_STATUS.NO_PROTOCOLS_ASSIGNED,
      edit_mode: { status: false, letter: "", label: "" },
    };
    Object.assign(state, replace_state);
  },
  set_rest_duration({ protocol_editor }, time) {
    protocol_editor.rest_duration = Number(time);
  },
  set_delay_axis_values(state, delay) {
    const { rest_duration, subprotocols, time_unit } = state.protocol_editor;

    const converted_delay_duration = rest_duration;
    const delay_pulse_model = {
      type: "Delay",
      duration: rest_duration,
      unit: time_unit,
    };
    state.delay_blocks = [delay];
    if (!isNaN(converted_delay_duration) && converted_delay_duration !== 0)
      subprotocols.push(delay_pulse_model);
  },
  set_new_protocol(state, protocol) {
    state.protocol_list = [...state.protocol_list, protocol];
  },
  set_stim_play_state(state, bool) {
    state.stim_play_state = bool;

    if (bool && state.stim_status === STIM_STATUS.STARTING) {
      state.stim_status = STIM_STATUS.STIM_ACTIVE;
    } else if (!bool && [STIM_STATUS.STIM_ACTIVE, STIM_STATUS.STOPPING].includes(state.stim_status)) {
      // this contradictory state occurs when 'Stimulate until complete' was selected for a stimulation.
      // the system status pinging returns a is_stimulating key that constantly updates the stim_play_state
      // currently no other way set up for the FE to know on it's own that a stimulation has run to completion
      state.stim_status = STIM_STATUS.READY;
    }
  },
  set_stim_status(state, status) {
    if (
      Object.keys(state.protocol_assignments).length === 0 &&
      ![STIM_STATUS.ERROR, STIM_STATUS.SHORT_CIRCUIT_ERROR, STIM_STATUS.CONFIG_CHECK_COMPLETE].includes(
        status
      )
    )
      state.stim_status = STIM_STATUS.NO_PROTOCOLS_ASSIGNED;
    else state.stim_status = status;
  },
  set_edit_mode(state, { label, letter }) {
    state.edit_mode.status = true;
    state.edit_mode.letter = letter;
    state.edit_mode.label = label;
  },
  set_edit_mode_off(state) {
    state.edit_mode.status = false;
    state.edit_mode.letter = "";
    state.edit_mode.label = "";
  },
  set_stop_setting({ protocol_editor }, setting) {
    protocol_editor.run_until_stopped = setting;
  },
  set_x_axis_time_idx(state, idx) {
    state.x_axis_time_idx = idx;
  },
  on_pulse_mouseleave(state) {
    state.hovered_pulse = { color: null, idx: null, indices: [] };
  },
  set_invalid_imported_protocols(state, protocols) {
    state.invalid_imported_protocols = [...protocols];
  },
  set_stim_start_time_idx(state, val) {
    state.stim_start_time_idx = val;
  },
};
