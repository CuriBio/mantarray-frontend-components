import { STIM_STATUS } from "./enums";

export default {
  set_selected_wells(state, wells) {
    state.selected_wells = wells;
  },
  apply_selected_protocol(state, protocol) {
    state.selected_wells.map((well) => {
      state.protocol_assignments[well] = protocol;
    });
    // Tanner (11/1/21): For some reason the whole object needs to be reassigned for Vuex to recognize that an update occurred
    state.protocol_assignments = { ...state.protocol_assignments };
  },
  clear_selected_protocol(state) {
    state.selected_wells.map((well) => delete state.protocol_assignments[well]);
    // Tanner (11/1/21): For some reason the whole object needs to be reassigned for Vuex to recognize that an update occurred
    state.protocol_assignments = { ...state.protocol_assignments };
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
    if (axis === "y-axis") state.y_axis_scale /= 1.5;
  },
  set_zoom_out(state, axis) {
    if (axis === "y-axis") state.y_axis_scale *= 1.5;
  },
  reset_protocol_editor(state) {
    const replace_state = {
      ...state,
      protocol_editor: {
        name: "",
        stimulation_type: "C",
        stop_setting: "Stimulate Until Stopped",
        rest_duration: 0,
        time_unit: "seconds",
        pulses: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
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
      protocol_editor: {
        name: "",
        stimulation_type: "C",
        stop_setting: "Stimulate Until Stopped",
        rest_duration: 0,
        time_unit: "seconds",
        pulses: [],
      },
      x_axis_values: [],
      y_axis_values: [],
      repeat_colors: {},
      y_axis_scale: 120,
      delay_blocks: [],
      x_axis_time_idx: 0,
      edit_mode: { status: false, letter: "", label: "" },
    };
    Object.assign(state, replace_state);
  },
  set_rest_duration({ protocol_editor }, time) {
    protocol_editor.rest_duration = Number(time);
  },
  set_delay_axis_values(state, delay) {
    const { rest_duration, pulses, time_unit } = state.protocol_editor;
    const delay_conversion = {
      seconds: 1000,
      milliseconds: 1,
      minutes: 60000,
      hours: 3600000,
    };
    const converted_delay_duration = rest_duration * delay_conversion[time_unit];
    const delay_pulse_model = {
      phase_one_duration: converted_delay_duration,
      phase_one_charge: 0,
      interphase_interval: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
      repeat_delay_interval: 0,
      total_active_duration: converted_delay_duration,
    };
    state.delay_blocks = [delay];
    if (!isNaN(converted_delay_duration) && converted_delay_duration !== 0) pulses.push(delay_pulse_model);
  },
  set_new_protocol({ protocol_list }, protocol) {
    protocol_list.push(protocol);
  },
  set_imported_protocol({ protocol_list }, protocol) {
    protocol_list.push(protocol);
  },
  set_stim_play_state(state, bool) {
    state.stim_play_state = bool;
    state.stim_status = bool ? STIM_STATUS.STIM_ACTIVE : STIM_STATUS.READY; // changes stimulation status component to reflect play state
  },
  set_stim_status(state, status) {
    state.stim_status = status;
  },
  set_edit_mode({ edit_mode }, { label, letter }) {
    edit_mode.status = true;
    edit_mode.label = label;
    edit_mode.letter = letter;
  },
  set_edit_mode_off({ edit_mode }) {
    edit_mode.status = false;
  },
  set_stop_setting({ protocol_editor }, setting) {
    protocol_editor.stop_setting = setting;
  },
  set_x_axis_time_idx(state, idx) {
    state.x_axis_time_idx = idx;
  },
};
