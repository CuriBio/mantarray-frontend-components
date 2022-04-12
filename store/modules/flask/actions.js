// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";

import { ENUMS as PLAYBACK_ENUMS } from "../playback/enums";
import { STIM_STATUS } from "../stimulation/enums";
import { STATUS } from "./enums";

/**
 * Function to Ping Flask server to get system_status
 * @return {void}
 */
export async function ping_system_status() {
  const params = { current_vuex_status_uuid: this.state.status_uuid };

  if (this.state.status_uuid === STATUS.MESSAGE.LIVE_VIEW_ACTIVE) {
    const current_time_index = this.rootState.playback.x_time_index;
    params.currently_displayed_time_index = current_time_index;
  }

  const url = "http://localhost:4567/system_status";
  const result = await call_axios_get_from_vuex(url, this, params);

  if (result.status == 200) {
    const data = result.data;
    const status_uuid = data.ui_status_code;

    const simulation_mode = data.in_simulation_mode;
    this.commit("set_simulation_status", simulation_mode);
    if (this.state.ignore_next_system_status_if_matching_this_status !== status_uuid) {
      if (status_uuid != this.state.status_uuid) {
        this.commit("set_status_uuid", status_uuid);
        if (status_uuid == STATUS.MESSAGE.CALIBRATION_NEEDED) {
          this.dispatch(
            "playback/transition_playback_state",
            PLAYBACK_ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED,
            { root: true }
          );
        } else if (status_uuid == STATUS.MESSAGE.CALIBRATED) {
          // awaiting to ensure playback state gets changed to this calibrated state before enabling stim controls
          await this.dispatch(
            "playback/transition_playback_state",
            PLAYBACK_ENUMS.PLAYBACK_STATES.CALIBRATED,
            {
              root: true,
            }
          );
          await this.commit("stimulation/set_stim_status", STIM_STATUS.CONFIG_CHECK_NEEDED, { root: true });
          this.commit("playback/set_enable_stim_controls", true, { root: true });
        } else if (status_uuid == STATUS.MESSAGE.LIVE_VIEW_ACTIVE) {
          this.dispatch(
            "playback/transition_playback_state",
            PLAYBACK_ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE,
            { root: true }
          );
        }
      }
    }
    this.commit("stimulation/set_stim_play_state", data.is_stimulating, { root: true });
  }
  this.commit("flask/ignore_next_system_status_if_matching_status", null, {
    root: true,
  }); // reset back to NULL now that a full call to /system_status has been processed
}

export default {
  async get_flask_action_context(context) {
    // useful for testing actions
    return context;
  },

  async start_status_pinging(context) {
    if (context.state.status_ping_interval_id === null) {
      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status(); // call the function immediately, instead of waiting for the first interval to elapse
      const new_interval_id = setInterval(bound_ping_system_status, 1000);

      context.commit("set_status_ping_interval_id", new_interval_id);
    }
  },
};
