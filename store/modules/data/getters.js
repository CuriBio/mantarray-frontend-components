// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  plate_waveforms(state) {
    return state.plate_waveforms;
  },
  heatmap_values(state) {
    return state.heatmap_values;
  },
  stim_waveforms(state) {
    return state.stim_waveforms;
  },
};
