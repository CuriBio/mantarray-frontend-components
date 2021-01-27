// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { ENUMS } from "./enums";
import { STATUS } from "../flask/enums";
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";

// =========================================================================
// |   Following are the list of items called --todo                       |
// |   a) baseurl {contains the flask server url } {obtain from config.ini}|
// |   b) api's /start_managed_acquisition         {obtain from config.ini}|
// |            /stop_managed_acquisition                                  |
// |            /start_recording                                           |
// |            /stop_recording                                            |
// |            /start_calibration                                         |
// |                                                                       |
// |  NOTE: The python flask server as development can manage api's by     |
// |        version eg:- /v{n}/start_managed_acquisition                   |
// |        in-order to have loose-coupling and App/UI changes can be      |
// |        rollout feature without Python Flask server change its good for|
// |        to have config.ini allowing App/UI to discover api's           |
// =========================================================================

const centimilliseconds_per_millisecond = 100;

/**
 * Function to progress the time_index
 * @return {void}
 */
function advance_playback_progression() {
  this.commit(
    "increment_x_time_index",
    this.rootState.playback.playback_progression_time_interval *
      centimilliseconds_per_millisecond
  );
}

export default {
  async get_playback_action_context(context) {
    // useful for testing actions
    return context;
  },

  async start_recording(context) {
    const time_index = this.state.playback.x_time_index;
    const barcode = this.state.playback.barcode;
    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "start_recording",
      time_index: time_index,
      barcode: barcode,
      is_hardware_test_recording: false,
    };
    context.commit("set_recording_start_time", time_index);
    await this.dispatch(
      "playback/start_stop_axios_request_with_time_index",
      payload
    );
    context.dispatch(
      "transition_playback_state",
      ENUMS.PLAYBACK_STATES.RECORDING
    );
    context.commit(
      "flask/ignore_next_system_status_if_matching_status",
      STATUS.MESSAGE.LIVE_VIEW_ACTIVE,
      { root: true }
    );
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.RECORDING, {
      root: true,
    });

    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.commit("set_playback_state", ENUMS.PLAYBACK_STATES.RECORDING);
    // }
  },

  async stop_recording(context) {
    const time_index = this.state.playback.x_time_index;
    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "stop_recording",
      time_index: time_index,
    };
    context.commit("set_recording_start_time", 0);
    await this.dispatch(
      "playback/start_stop_axios_request_with_time_index",
      payload
    );
    context.commit(
      "set_playback_state",
      ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
    );
    context.commit("stop_recording");
    context.commit(
      "flask/ignore_next_system_status_if_matching_status",
      STATUS.MESSAGE.RECORDING,
      { root: true }
    );
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.LIVE_VIEW_ACTIVE, {
      root: true,
    });
    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.commit(
    //     "set_playback_state",
    //     ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
    //   );
    //   context.commit("stop_recording");
    // }
  },
  async stop_live_view(context) {
    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "stop_managed_acquisition",
    };
    await this.dispatch("playback/start_stop_axios_request", payload);
    context.commit("waveform/stop_waveform_pinging", null, { root: true });
    context.commit("waveform/clear_plate_waveforms", null, { root: true });
    context.dispatch(
      "transition_playback_state",
      ENUMS.PLAYBACK_STATES.CALIBRATED
    );
    context.commit("set_x_time_index", 0);
    context.commit(
      "flask/ignore_next_system_status_if_matching_status",
      STATUS.MESSAGE.LIVE_VIEW_ACTIVE,
      { root: true }
    );
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.STOPPED, {
      root: true,
    });
    context.commit("stop_playback_progression");

    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.commit("set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
    // }
  },
  async start_calibration(context) {
    context.dispatch(
      "transition_playback_state",
      ENUMS.PLAYBACK_STATES.CALIBRATING
    );
    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "start_calibration",
    };
    await this.dispatch("playback/start_stop_axios_request", payload);
    context.commit(
      "flask/ignore_next_system_status_if_matching_status",
      this.state.flask.status_uuid,
      { root: true }
    );

    context.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING, {
      root: true,
    });

    context.dispatch("flask/start_status_pinging", null, { root: true });
    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.dispatch("flask/start_status_pinging", null, { root: true });
    // }
  },
  async stop_playback(context) {
    context.commit("set_x_time_index", 0);
    await this.dispatch(
      "playback/transition_playback_state",
      ENUMS.PLAYBACK_STATES.STOPPED
    );
  },
  async transition_playback_state(context, new_state) {
    const current_playback_state = this.state.playback.playback_state;
    context.commit("set_playback_state", new_state);
    if (new_state == ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE) {
      if (
        current_playback_state === ENUMS.PLAYBACK_STATES.BUFFERING ||
        current_playback_state === ENUMS.PLAYBACK_STATES.STOPPED
      ) {
        await this.dispatch("playback/start_playback_progression");
      }
    }
    if (
      current_playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE &&
      new_state === ENUMS.PLAYBACK_STATES.STOPPED
    ) {
      context.commit("stop_playback_progression");
    }
  },
  async start_playback_progression(context) {
    if (context.state.playback_progression_interval_id === null) {
      const bound_advance_playback_progression = advance_playback_progression.bind(
        context
      );

      const new_interval_id = setInterval(
        bound_advance_playback_progression,
        this.state.playback.playback_progression_time_interval
      );

      context.commit("set_playback_progression_interval_id", new_interval_id);
    }
  },
  async start_live_view(context) {
    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "start_managed_acquisition",
    };
    await this.dispatch("playback/start_stop_axios_request", payload);
    context.dispatch(
      "transition_playback_state",
      ENUMS.PLAYBACK_STATES.BUFFERING
    );
    context.commit(
      "flask/ignore_next_system_status_if_matching_status",
      STATUS.MESSAGE.CALIBRATED,
      { root: true }
    );
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING, {
      root: true,
    });

    context.dispatch("flask/start_status_pinging", null, { root: true });
    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.dispatch("flask/start_status_pinging", null, { root: true });
    // }
  },
  async start_stop_axios_request_with_time_index(context, payload) {
    let result = 0;
    const baseurl = payload.baseurl;
    const endpoint = payload.endpoint;
    const time_index = payload.time_index;
    let no_barcode = false;
    let barcode = null;
    let whole_url = ``;
    if (payload.barcode == undefined) {
      no_barcode = true;
    } else {
      barcode = payload.barcode;
    }
    if (no_barcode == true) {
      whole_url = `${baseurl}/${endpoint}?time_index=${time_index}`;
    } else {
      whole_url = `${baseurl}/${endpoint}?time_index=${time_index}&barcode=${barcode}&is_hardware_test_recording=${payload.is_hardware_test_recording}`;
    }
    result = call_axios_get_from_vuex(whole_url, context);
    return result;
  },
  async start_stop_axios_request(context, payload) {
    let result = 0;
    const baseurl = payload.baseurl;
    const endpoint = payload.endpoint;
    const whole_url = `${baseurl}/${endpoint}`;
    result = call_axios_get_from_vuex(whole_url, context);
    return result;
  },
};
