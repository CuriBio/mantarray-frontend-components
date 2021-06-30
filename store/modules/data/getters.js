// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  plate_waveforms(state) {
    return state.plate_waveforms;
  },

  get_waveform_ping_interval_id(state) {
    return state.waveform_ping_interval_id;
  },

  heatmap_values(state) {
    return state.heatmap_values;
  },
};

// heatmap_on_idx(state) {
//   return state.heatmap_values[state.heatmap_idx];
// },
