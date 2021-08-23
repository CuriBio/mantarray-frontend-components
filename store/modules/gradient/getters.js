export default {
  gradient_color(state) {
    return state.gradient.color;
  },
  gradient_steps(state) {
    return state.gradient.steps;
  },
  gradient_range(state) {
    return { min: state.gradient_range_min, max: state.gradient_range_max };
  },
  gradient_color_mapping: (state) => (value) => {
    let color_idx =
      (value - state.gradient_range_min) / (state.gradient_range_max - state.gradient_range_min);
    if (color_idx > 1) color_idx = 1;
    else if (color_idx < 0) color_idx = 0;
    return state.gradient.color(color_idx).toString();
  },
};
