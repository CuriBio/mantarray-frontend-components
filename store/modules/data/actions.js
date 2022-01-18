// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import {
  append_well_data,
  convert_x_y_arrays_to_d3_array,
  find_closest_array_idx,
} from "../../../js_utils/waveform_data_formatter.js";

export default {
  async append_plate_waveforms({ dispatch, commit, state }, new_value) {
    const appended_waveforms = append_well_data(state.plate_waveforms, new_value);
    commit("set_plate_waveforms", appended_waveforms);
    dispatch("remove_old_waveform_data");
  },
  remove_old_waveform_data({ rootState }) {
    const { waveform, playback, data } = rootState;
    const max_x_min_value = playback.x_time_index - waveform.x_zoom_levels[0].x_scale;
    // remove time points indices that are older than the x min at max zoom out
    data.plate_waveforms.map((well) => {
      const idx_to_splice = find_closest_array_idx(well.x_data_points, max_x_min_value);
      well.x_data_points.splice(0, idx_to_splice - 2);
      well.y_data_points.splice(0, idx_to_splice - 2);
    });
  },
  async get_data_action_context(context) {
    // useful for testing actions
    return context;
  },
  async append_stim_waveforms({ dispatch, state }, new_values) {
    for (const well_idx in new_values) {
      if (new_values[well_idx] !== undefined && state.plate_waveforms[well_idx] !== undefined) {
        // real Y values not actually used yet, just need to draw a straight vertical line at each new x value and connect the points at a Y value out of the max zoom window
        const new_well_values = new_values[well_idx];

        let idx = 0;
        while (idx < new_well_values[0].length) {
          const x = new_well_values[0][idx];
          const y_points = [101000, -201, 101000]; // arbitrary values far enough outside of max window that the connection between vertical lines will not be rendered
          y_points.map((y) => {
            state.stim_waveforms[well_idx].x_data_points.push(x);
            state.stim_waveforms[well_idx].y_data_points.push(y);
          });
          state.sub_protocol_flags[well_idx].push([new_well_values[1][idx], x]);
          idx++;
        }
        dispatch("assign_stim_fill_colors", well_idx);
      }
    }
    // dispatch("remove_old_stim_data");
  },
  assign_stim_fill_colors({ state }, well_idx) {
    const time_x_values = state.stim_waveforms[well_idx].x_data_points;
    const time_y_values = state.stim_waveforms[well_idx].y_data_points;
    const flags_copy = state.sub_protocol_flags[well_idx];
    if (flags_copy.length > 0) {
      for (const sub of flags_copy) {
        const start_idx = time_x_values.indexOf(sub[1]) + 1; // want index with y-value === -201
        const sliced_x_values = time_x_values.slice(start_idx, start_idx + 4);
        const sliced_y_values = time_y_values.slice(start_idx, start_idx + 4);
        const sliced_d3_subprotocol = convert_x_y_arrays_to_d3_array(sliced_x_values, sliced_y_values);
        state.stim_fill_assignments[well_idx].push([sub[0], sliced_d3_subprotocol]);
      }
      state.sub_protocol_flags[well_idx] = [flags_copy[flags_copy.length - 1]];
    }
  },
  remove_old_stim_data({ rootState }) {
    const { waveform, playback, data } = rootState;
    const max_x_min_value = playback.x_time_index - waveform.x_zoom_levels[0].x_scale;
    const entries = data.stim_waveforms.length;
    let idx = 0;
    while (idx < entries) {
      const fill_idx_to_splice = find_closest_array_idx(data.stim_fill_assignments[idx], max_x_min_value);
      data.stim_fill_assignments[idx].splice(0, fill_idx_to_splice - 2);

      const flags_idx_to_splice = find_closest_array_idx(data.sub_protocol_flags[idx], max_x_min_value);
      data.sub_protocol_flags[idx].splice(0, flags_idx_to_splice - 2);

      const data_idx_to_splice = find_closest_array_idx(
        data.stim_waveforms[idx].x_data_points,
        max_x_min_value
      );

      data.stim_waveforms[idx].x_data_points.splice(0, data_idx_to_splice - 2);
      data.stim_waveforms[idx].y_data_points.splice(0, data_idx_to_splice - 2);

      idx++;
    }
  },
};
