// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  heatmap_values(state) {
    return state.heatmap_values;
  },
};

// heatmap_on_idx(state) {
//   return state.heatmap_values[state.heatmap_idx];
// },
