// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { ENUMS } from "./enums";
import { STATUS } from "../flask/enums";
import { STIM_STATUS } from "../stimulation/enums";
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";
import { TextValidation } from "@/js_utils/text_validation.js";
const TextValidation_plate_barcode = new TextValidation("plate_barcode");
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

export const micros_per_milli = 1000;
let five_min_timer = null;
let one_min_timer = null;
/**
 * Function to progress the time_index
 * @return {void}
 */
export function advance_playback_progression() {
  const delay_threshold_milliseconds = this.rootState.playback.num_milliseconds_to_fast_forward_if_delayed;
  const starting_timestamp = this.rootState.playback.timestamp_of_beginning_of_progression;
  const expected_display_time = starting_timestamp + this.rootState.playback.x_time_index / micros_per_milli;
  const current_timestamp = performance.now();
  let milliseconds_to_increment = this.rootState.playback.playback_progression_time_interval;
  if (current_timestamp - expected_display_time >= delay_threshold_milliseconds) {
    milliseconds_to_increment = delay_threshold_milliseconds;
  }
  this.commit("increment_x_time_index", milliseconds_to_increment * micros_per_milli);
}

export default {
  async get_playback_action_context(context) {
    // useful for testing actions
    return context;
  },

  async start_recording(context) {
    const time_index = this.state.playback.x_time_index;
    const plate_barcode = this.state.playback.barcodes.plate_barcode.value;
    const stim_barcode = this.state.playback.barcodes.stim_barcode.value;
    const url = "http://localhost:4567/start_recording";
    const params = {
      time_index,
      plate_barcode,
      is_hardware_test_recording: false,
      stim_barcode,
    };
    context.commit("set_recording_start_time", time_index);
    await call_axios_get_from_vuex(url, context, params);
    context.dispatch("transition_playback_state", ENUMS.PLAYBACK_STATES.RECORDING);
    context.commit("flask/ignore_next_system_status_if_matching_status", STATUS.MESSAGE.LIVE_VIEW_ACTIVE, {
      root: true,
    });
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.RECORDING, {
      root: true,
    });
  },

  async stop_recording(context) {
    const time_index = this.state.playback.x_time_index;
    const url = "http://localhost:4567/stop_recording";
    const params = { time_index };
    context.commit("set_recording_start_time", 0);
    await call_axios_get_from_vuex(url, context, params);
    context.commit("set_playback_state", ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);
    context.commit("stop_recording");
    context.commit("flask/ignore_next_system_status_if_matching_status", STATUS.MESSAGE.RECORDING, {
      root: true,
    });
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
    const url = "http://localhost:4567/stop_managed_acquisition";
    await call_axios_get_from_vuex(url, context);
    context.commit("data/clear_plate_waveforms", null, { root: true });
    context.commit("data/clear_stim_waveforms", null, { root: true });
    context.dispatch("transition_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
    context.commit("set_x_time_index", 0);
    context.commit("flask/ignore_next_system_status_if_matching_status", STATUS.MESSAGE.LIVE_VIEW_ACTIVE, {
      root: true,
    });
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATED, {
      root: true,
    });
    context.commit("stop_playback_progression");
    context.commit("data/clear_heatmap_values", null, { root: true });

    // stop any timers from running
    clearInterval(one_min_timer);
    clearTimeout(five_min_timer);
    context.commit("set_one_min_warning", false);
    context.commit("set_five_min_warning", false);

    // Eli (6/11/20): wait until we have error handling established and unit tested before conditionally doing things based on status
    // if (response.status == 200) {
    //   context.commit("set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
    // }
  },
  async start_calibration(context) {
    context.dispatch("transition_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATING);
    const url = "http://localhost:4567/start_calibration";
    await call_axios_get_from_vuex(url, context);
    context.commit("flask/ignore_next_system_status_if_matching_status", this.state.flask.status_uuid, {
      root: true,
    });

    context.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING, {
      root: true,
    });

    context.dispatch("flask/start_status_pinging", null, { root: true });
  },
  async stop_playback(context) {
    context.commit("set_x_time_index", 0);
    await this.dispatch("playback/transition_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
  },
  async transition_playback_state(context, new_state) {
    const current_playback_state = this.state.playback.playback_state;
    context.commit("set_playback_state", new_state);
    if (new_state == ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE) {
      if (current_playback_state === ENUMS.PLAYBACK_STATES.BUFFERING) {
        await this.dispatch("playback/start_playback_progression");
      }
    }
    if (
      current_playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE &&
      new_state === ENUMS.PLAYBACK_STATES.CALIBRATED
    ) {
      context.commit("stop_playback_progression");
    }
  },
  async start_playback_progression(context) {
    if (context.state.playback_progression_interval_id === null) {
      const bound_advance_playback_progression = advance_playback_progression.bind(context);

      const new_interval_id = setInterval(
        bound_advance_playback_progression,
        this.state.playback.playback_progression_time_interval
      );

      context.commit("set_playback_progression_interval_id", new_interval_id);
      context.commit("mark_timestamp_of_beginning_of_progression");
    }
  },
  async start_live_view(context) {
    // reset to default state and then set new timer
    context.dispatch("set_five_min_timer");

    const url = "http://localhost:4567/start_managed_acquisition";
    await call_axios_get_from_vuex(url, context);
    context.dispatch("transition_playback_state", ENUMS.PLAYBACK_STATES.BUFFERING);
    context.commit("flask/ignore_next_system_status_if_matching_status", STATUS.MESSAGE.CALIBRATED, {
      root: true,
    });
    context.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING, {
      root: true,
    });
    context.dispatch("flask/start_status_pinging", null, { root: true });
  },
  set_five_min_timer(context) {
    five_min_timer = setTimeout(() => {
      context.commit("set_five_min_warning", true);
    }, 5 * 60e3);
  },
  set_one_min_timer(context) {
    one_min_timer = setInterval(() => {
      context.commit("set_one_min_warning", true);
    }, 1 * 60e3);
  },
  validate_barcode({ commit, state, dispatch }, { type, new_value }) {
    const result = TextValidation_plate_barcode.validate(new_value);
    const is_valid = result == "";

    // stop all running processes if either barcode changes regardless of validity
    if (this.state.stimulation.stim_play_state) this.dispatch("stimulation/stop_stimulation");
    if (state.playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE) dispatch("stop_live_view");
    else if (state.playback_state === ENUMS.PLAYBACK_STATES.RECORDING) dispatch("stop_recording");

    // require new stim configuration check if either new barcode changes
    if (is_valid && state.barcodes[type].value !== new_value) {
      this.commit("stimulation/set_stim_status", STIM_STATUS.CONFIG_CHECK_NEEDED);
    }

    commit("set_barcode", { type, new_value, is_valid });
  },
};
