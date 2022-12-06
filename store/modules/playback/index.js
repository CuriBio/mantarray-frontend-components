// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { ENUMS } from "./enums";

const default_state = {
  enable_stim_controls: false,
  loop_playback: false,
  is_playing: false,
  x_time_index: 0,
  playback_state: ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT,
  recording_start_time: 0,
  playback_progression_interval_id: null,
  playback_progression_time_interval: 40, // milliseconds
  barcodes: {
    plate_barcode: {
      value: null,
      valid: false,
    },
    stim_barcode: {
      value: null,
      valid: false,
    },
  },
  tooltips_delay: 2000,
  timestamp_of_beginning_of_progression: undefined,
  num_milliseconds_to_fast_forward_if_delayed: 400,
  barcode_warning: false,
  data_analysis_state: ENUMS.DATA_ANALYSIS_STATE.READY,
  start_recording_from_stim: false,
  is_recording_snapshot_running: false,
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
