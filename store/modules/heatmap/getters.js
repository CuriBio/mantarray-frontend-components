// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  heatmap_idx(state) {
    return state.heatmap_idx;
  },
  heatmap_values(state) {
    return state.heatmap_values;
  },
};
