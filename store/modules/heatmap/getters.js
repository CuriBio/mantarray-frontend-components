// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  heatmap_idx(state) {
    return state.heatmap_idx;
  },
  heatmap_values(state) {
    return state.heatmap_values;
  },
  heatmap_on_idx(state) {
    return state.heatmap_values[state.heatmap_idx];
  },
  heatmap_display_array(state) {
    return state.heatmap_display_array;
  },
  heatmap_display_idx(state) {
    return state.heatmap_display_idx;
  },
  heatmap_max_min(state) {
    return state.heatmap_display_min_max;
  },
  heatmap_display_min_max(state) {
    return state.heatmap_display_min_max;
  },
  heatmap_autoscale(state) {
    return state.heatmap_autoscale;
  },
  heatmap_options_array(state) {
    return state.heatmap_options_array;
  },
  heatmap_options_idx(state) {
    return state.heatmap_options_idx;
  },
};
