// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { append_get_available_well_data } from "@/js_utils/waveform_data_formatter.js";

export default {
  set_plate_waveforms(state, new_value) {
    state.plate_waveforms = new_value;
  },
  clear_plate_waveforms(state) {
    for (let i = 0; i < state.plate_waveforms.length; i++) {
      state.plate_waveforms[i] = { x_data_points: [], y_data_points: [] };
    }
  },

  append_plate_waveforms(state, new_value) {
    const new_waveforms = append_get_available_well_data(state.plate_waveforms, new_value);
    // Eli (6/25/20): Vuex needs special things to take place in order to react to changes in complex objects, such as using this spread operator. It does not be default react to some attribute of an object being updated https://stackoverflow.com/questions/59039029/vuex-doesnt-react-with-complex-object
    state.plate_waveforms = { ...new_waveforms };
  },

  set_waveform_ping_interval_id(state, new_id) {
    state.waveform_ping_interval_id = new_id;
  },
  stop_waveform_pinging(state) {
    if (state.waveform_ping_interval_id !== null) {
      clearInterval(state.waveform_ping_interval_id);
      state.waveform_ping_interval_id = null;
    }
  },
  set_x_axis_zoom_levels(state, new_value) {
    state.x_zoom_levels = new_value;
  },
  set_x_axis_zoom_idx(state, new_value) {
    state.x_zoom_level_idx = new_value;
  },
  set_y_axis_zoom_levels(state, new_value) {
    state.y_zoom_levels = new_value;
  },
  set_y_axis_zoom_idx(state, new_value) {
    state.y_zoom_level_idx = new_value;
  },
  set_barcode_manual_mode(state, new_value) {
    state.barcode_manual_mode = new_value;
  },
};
