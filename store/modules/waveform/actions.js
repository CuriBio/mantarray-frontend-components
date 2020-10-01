// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import Vue from "vue";

import { get_recording } from "../../../store/ApiService.js";
import { convert_from_json_of_well_indices_and_x_y_arrays } from "../../../js_utils/waveform_data_formatter.js";

/**
 * Function to Ping Flask server to get_available_data for waveform
 * @return {void}
 */
export async function ping_get_available_data() {
  const current_time_index = this.rootState.playback.x_time_index;
  const payload = {
    baseurl: "http://localhost:4567",
    endpoint:
      "get_available_data?currently_displayed_time_index=" + current_time_index,
  };
  let result = 0;
  const whole_url = `${payload.baseurl}/${payload.endpoint}`;

  result = await Vue.axios.get(whole_url);
  if (result.status == 200) {
    const data = result.data;
    this.commit("append_plate_waveforms", data);
  }
}

export default {
  async fetchApi({ commit }) {
    const num_waveforms_to_display = 24;
    const parsed_data = [];
    try {
      const http_response = await get_recording("sandbox_eli_waveform");
      const json_data = http_response.data;

      for (let i = 0; i < num_waveforms_to_display; i++) {
        const this_well_data = convert_from_json_of_well_indices_and_x_y_arrays(
          json_data,
          i
        );
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

  async get_waveform_action_context(context) {
    // useful for testing actions
    return context;
  },

  async start_get_waveform_pinging(context) {
    if (context.state.waveform_ping_interval_id === null) {
      const bound_ping_get_waveform_data = ping_get_available_data.bind(
        context
      );
      await bound_ping_get_waveform_data(); // call the function immediately, instead of waiting for the first interval to elapse
      const new_interval_id = setInterval(bound_ping_get_waveform_data, 7000);
      context.commit("set_waveform_ping_interval_id", new_interval_id);
    }
  },
};
