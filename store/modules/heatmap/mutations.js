export default {
  set_heatmap_idx(state, new_value) {
    state.heatmap_idx = new_value;
  },
  set_heatmap_values(state, new_value) {
    state.heatmap_values = new_value;
  },
  set_heatmap_options_idx(state, new_value) {
    state.heatmap_options_idx = new_value;
  },
  set_metric_data(state, new_value) {
    state.heatmap_values[new_value.name].data.forEach((item, ix) => {
      item.push(new_value.data[ix]);
    });
  },
  set_heatmap_autoscale(state, new_value) {
    state.heatmap_autoscale = new_value;
  },
  set_heatmap_options_gradient(state, new_value) {
    state.heatmap_options_gradient = new_value;
  },
};
// set_heatmap_on_idx(state, new_value) {
//   state.heatmap_values[state.heatmap_idx] = new_value;
// },
// set_heatmap_display_array(state, new_value) {
//   state.heatmap_display_array = new_value;
// },
// set_heatmap_display_idx(state, new_value) {
//   state.heatmap_display_idx = new_value;
// },
// set_heatmap_display_min_max(state, new_value) {
//   state.heatmap_display_min_max = new_value;
// },
// set_heatmap_display_user_min_max(state, new_value) {
//   state.heatmap_display_user_min_max = new_value;
// },
//
