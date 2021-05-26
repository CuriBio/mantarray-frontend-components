export default {
  set_gradient_theme_idx(state, new_value) {
    state.gradient_theme_idx = new_value;
    state.gradient = state.gradients[new_value];
  },
  set_gradient_range(state, new_value) {
    state.gradient_range_min = new_value.min;
    state.gradient_range_max = new_value.max;
  },
};
