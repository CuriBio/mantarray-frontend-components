// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { ENUMS } from "./enums";

const default_state = {
  enable_additional_controls: false,
  loop_playback: false,
  is_playing: false,
  x_time_index: 0,
  playback_state: ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT,
  recording_start_time: 0,
  playback_progression_interval_id: null,
  playback_progression_time_interval: 40, // milliseconds
  barcode: null,
  is_valid_barcode: false,
  tooltips_delay: 2000,
  timestamp_of_beginning_of_progression: undefined,
  num_milliseconds_to_fast_forward_if_delayed: 400,
  five_min_warning: false,
  one_min_warning: false,
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
  ENUMS,
};
