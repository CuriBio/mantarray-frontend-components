// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { get_recording } from "../../../store/ApiService.js";
import {
  convert_from_json_of_well_indices_and_x_y_arrays,
  convert_x_y_arrays_to_d3_array,
} from "../../../js_utils/waveform_data_formatter.js";

export default {
  async fetchApi({ commit }) {
    const num_waveforms_to_display = 24;
    const parsed_data = [];
    try {
      const http_response = await get_recording("sandbox_eli_waveform");
      const json_data = http_response.data;

      for (let i = 0; i < num_waveforms_to_display; i++) {
        const this_well_data = convert_from_json_of_well_indices_and_x_y_arrays(json_data, i);
        parsed_data.push({
          x_data_points: this_well_data.sample_indices,
          y_data_points: this_well_data.values,
        });
      }
    } catch (e) {
      console.error(e);
    }
    commit("set_plate_waveforms", parsed_data);
    return parsed_data;
  },

  async get_data_action_context(context) {
    // useful for testing actions
    return context;
  },

  async append_stim_waveforms({ dispatch, state }, new_values) {
    console.log(new_values);
    for (const well_idx in new_values) {
      if (new_values[well_idx] !== undefined && state.plate_waveforms[well_idx] !== undefined) {
        // real Y values not actually used yet, just need to draw a straight vertical line at each new x value and connect the points at a Y value out of the max zoom window
        const new_well_values = new_values[well_idx];

        // aligns color blocking with start of tissue data when live view starts after stim
        new_well_values[0][0] =
          new_well_values[0][0] < state.plate_waveforms[well_idx].x_data_points[0]
            ? state.plate_waveforms[well_idx].x_data_points[0]
            : new_well_values[0][0];

        new_well_values[0].map((x) => {
          const y_points = [101000, -201, 101000]; // arbitrary values far enough outside of max window that the connection between vertical lines will not be rendered
          y_points.map((y) => {
            state.stim_waveforms[well_idx].x_data_points.push(x);
            state.stim_waveforms[well_idx].y_data_points.push(y);
          });

          state.sub_protocol_flags[well_idx].push([new_well_values[1], x]);
        });
        dispatch("assign_stim_fill_colors", well_idx);
      }
    }
  },
  assign_stim_fill_colors({ state }, well_idx) {
    state.stim_fill_assignments[well_idx] = []; // reset because indices are changing for each time index

    const time_x_values = state.stim_waveforms[well_idx].x_data_points;
    const time_y_values = state.stim_waveforms[well_idx].y_data_points;

    state.sub_protocol_flags[well_idx].map((sub) => {
      const start_idx = time_x_values.indexOf(sub[1]) + 1; // want index with y-value === -201
      const sliced_x_values = time_x_values.slice(start_idx, start_idx + 4);
      const sliced_y_values = time_y_values.slice(start_idx, start_idx + 4);
      const sliced_d3_subprotocol = convert_x_y_arrays_to_d3_array(sliced_x_values, sliced_y_values);

      state.stim_fill_assignments[well_idx].push([sub[0], sliced_d3_subprotocol]);
    });
  },
};
