// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";

import { ENUMS as PLAYBACK_ENUMS } from "../playback/enums";
import { STATUS } from "./enums";

/**
 * Function to Ping Flask server to get system_status
 * @return {void}
 */
export async function ping_system_status() {
  // const current_time_index = this.rootState.playback.x_time_index;
  const payload = {
    baseurl: "http://localhost:4567",
    endpoint: "system_status?current_vuex_status_uuid=" + this.state.status_uuid, // + "currently_displayed_time_index=" + current_time_index
  };
  const whole_url = `${payload.baseurl}/${payload.endpoint}${payload.val}`;
  // console.log("about to ping system status: " + whole_url)
  let result = 0;
  // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
  result = await call_axios_get_from_vuex(whole_url, this);
  // console.log("Result from system_status: " + JSON.stringify(result));
  if (result.status == 200) {
    const data = result.data;
    const status_uuid = data.ui_status_code;

    const simulation_mode = data.in_simulation_mode;
    if (this.state.barcode_manual_mode === false) {
      if (data.plate_barcode != undefined) {
        const plate_barcode = data.plate_barcode;
        if (plate_barcode == "") {
          this.commit("playback/set_barcode_number", null, { root: true });
        } else {
          this.commit("playback/set_barcode_number", plate_barcode, {
            root: true,
          });
        }
      }
    }
    this.commit("set_simulation_status", simulation_mode);
    if (this.state.ignore_next_system_status_if_matching_this_status !== status_uuid) {
      if (status_uuid != this.state.status_uuid) {
        this.commit("set_status_uuid", status_uuid);
        if (status_uuid == STATUS.MESSAGE.CALIBRATION_NEEDED_uuid) {
          this.dispatch(
            "playback/transition_playback_state",
            PLAYBACK_ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED,
            { root: true }
          );
        }
        if (status_uuid == STATUS.MESSAGE.STOPPED) {
          this.dispatch("playback/transition_playback_state", PLAYBACK_ENUMS.PLAYBACK_STATES.CALIBRATED, {
            root: true,
          });
        }

        if (status_uuid == STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid) {
          this.dispatch(
            "playback/transition_playback_state",
            PLAYBACK_ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE,
            { root: true }
          );
        }
      }
    }
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
