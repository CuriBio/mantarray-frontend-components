// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  set_x_axis_zoom_levels(state, new_value) {
    state.x_zoom_levels = new_value;
  },
  set_x_axis_zoom_idx(state, new_value) {
    state.x_zoom_level_idx = new_value;
  },
  set_y_axis(state, range) {
    state.y_axis_range = range;
    state.y_axis_scale = range.max - range.midpoint;
  },
  set_y_axis_zoom_in(state) {
    state.y_axis_scale /= 1.5;
  },
  set_y_axis_zoom_out(state) {
    state.y_axis_scale *= 1.5;
  },
};
