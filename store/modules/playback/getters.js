// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import { ENUMS } from "./enums";

export default {
  is_playing(state) {
    // Eli (5/5/20): This is deprecated---future code should just reference the playback_state directly
    return state.playback_state === ENUMS.PLAYBACK_STATES.PLAYING;
  },
  loop_playback(state) {
    return state.loop_playback;
  },
  x_time_index(state) {
    return state.x_time_index;
  },
  recording_start_time(state) {
    return state.recording_start_time;
  },
  barcode_number(state) {
    return state.barcode;
  },
  tooltips_delay(state) {
    return state.tooltips_delay;
  },
};
