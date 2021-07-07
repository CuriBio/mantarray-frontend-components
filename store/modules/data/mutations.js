// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { append_get_available_well_data } from "@/js_utils/waveform_data_formatter.js";
import { TWITCH } from "@/store/modules/data/enums";

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

  set_heatmap_values(state, new_value) {
    state.heatmap_values = new_value;
  },
  set_metric_data(state, new_value) {
    state.heatmap_values[new_value.name].data.forEach((item, idx) => {
      item.push(new_value.data[idx]);
    });
  },
  append_metric_data(state, new_values) {
    for (const well_idx in new_values) {
      if (new_values[well_idx] !== undefined) {
        const new_well_values = new_values[well_idx];
        for (const metric_name in state.heatmap_values) {
          if (new_well_values[TWITCH.METRIC_IDS[metric_name]] !== undefined) {
            state.heatmap_values[metric_name].data[well_idx].push(
              ...new_well_values[TWITCH.METRIC_IDS[metric_name]]
            );
          }
        }
      }
    }
  },
};
