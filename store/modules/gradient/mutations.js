export default {
  set_gradient_theme_idx(state, new_value) {
    state.gradient_theme_idx = new_value;
    state.gradient = state.gradients[new_value];
  },
  set_gradient_range(state, new_value) {
    state.gradient_range_min = new_value.min;
    state.gradient_range_max = new_value.max;
  },
  reset_gradient_theme_idx(state) {
    // Tanner (7/27/21): tried just calling set_gradient_theme_idx(0), did not seem to want to work
    state.gradient_theme_idx = 0;
    state.gradient = state.gradients[state.gradient_theme_idx];
  },
  reset_gradient_range(state) {
    state.gradient_range_min = 0;
    state.gradient_range_max = 1;
  },
};
