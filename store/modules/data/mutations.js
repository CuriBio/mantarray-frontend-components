// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { TWITCH } from "@/store/modules/data/enums";

export default {
  set_plate_waveforms(state, new_value) {
    state.plate_waveforms = [...new_value];
  },
  clear_plate_waveforms(state) {
    for (let i = 0; i < state.plate_waveforms.length; i++) {
      state.plate_waveforms[i] = { x_data_points: [], y_data_points: [] };
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
            state.heatmap_values[metric_name].data[well_idx] = state.heatmap_values[metric_name].data[
              well_idx
            ].slice(-100);
          }
        }
      }
    }
  },
  clear_heatmap_values(state) {
    for (const metric_name in state.heatmap_values) {
      if (state.heatmap_values[metric_name].data !== undefined) {
        const num_wells = state.heatmap_values[metric_name].data.length;
        state.heatmap_values[metric_name].data = [...Array(num_wells)].map((e) => Array(0));
      }
    }
  },
  set_stim_waveforms(state, new_value) {
    state.stim_waveforms = new_value;
  },
  clear_stim_waveforms(state) {
    for (let i = 0; i < state.stim_waveforms.length; i++) {
      state.stim_waveforms[i] = { x_data_points: [], y_data_points: [] };
      state.stim_fill_assignments[i] = [];
      state.last_protocol_flag[i] = [];
    }
  },
  set_fill_colors(state, payload) {
    const { stim_fill_colors, well } = payload;
    const copy = state.stim_fill_colors; // required to be reactive
    copy[well] = stim_fill_colors;
    state.stim_fill_colors = { ...copy };
  },
};
