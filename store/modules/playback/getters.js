// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  x_time_index(state) {
    return state.x_time_index;
  },
  recording_start_time(state) {
    return state.recording_start_time;
  },
};
