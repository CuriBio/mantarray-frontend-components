// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  heatmap_autoscale(state) {
    return state.heatmap_autoscale;
  },
  heatmap_options_gradient(state) {
    return state.heatmap_options_gradient;
  },
};

// heatmap_idx(state) {
//   return state.heatmap_idx;
// },
// heatmap_display_array(state) {
//   return state.heatmap_display_array;
// },
// heatmap_display_idx(state) {
//   return state.heatmap_display_idx;
// },
// heatmap_display_option(state) {
//   return state.heatmap_display_array[state.heatmap_display_idx];
// },
// heatmap_display_user_min_max(state) {
//   return state.heatmap_display_user_min_max;
// },
// heatmap_display_min_max(state) {
//   return state.heatmap_display_min_max;
// },
// heatmap_display_min_max_selected(state) {
//   return state.heatmap_display_min_max[state.heatmap_display_idx];
// },
// heatmap_options_idx(state) {
//   return state.heatmap_options_idx;
// },
// heatmap_options_on_idx(state) {
//   return state.heatmap_options_array[state.heatmap_options_idx];
// },
// heatmap_options_on_gradient(state) {
//   return state.heatmap_options_gradient[state.heatmap_options_array[state.heatmap_options_idx]];
// },
