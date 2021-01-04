// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  loop_playback(state) {
    return state.loop_playback;
  },
  x_time_index(state) {
    return state.x_time_index;
  },
  recording_start_time(state) {
    return state.recording_start_time;
  },
};
