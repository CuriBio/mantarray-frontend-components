"use strict";
import Vue from "vue";
import { STATUS } from "@/store/modules/flask/enums";

/**
 * Handles all HTTP GET calls from Vuex and updates system status if there was an error
 *
 * @param {string} whole_url - The entire URL to pass to axios.get
 * @param {Object} action_context - The context of the Vuex action calling this function (to give this function access to the Vuex store)
 * @return {Object} the result of the axios call
 */
export async function call_axios_get_from_vuex(whole_url, action_context) {
  let result = 0;
  try {
    result = await Vue.axios.get(whole_url);
  } catch (error) {
    action_context.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR, {
      root: true,
    });
    action_context.commit("flask/stop_status_pinging"); // Error reported clear the ping_system_status
    action_context.commit("playback/stop_playback_progression");
    action_context.commit("waveform/stop_waveform_pinging");
  }
  return result;
}
