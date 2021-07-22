// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { get_recording } from "../../../store/ApiService.js";
import { convert_from_json_of_well_indices_and_x_y_arrays } from "../../../js_utils/waveform_data_formatter.js";

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
};
