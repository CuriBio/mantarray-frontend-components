// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  set_x_axis_zoom_levels(state, new_value) {
    state.x_zoom_levels = new_value;
  },
  set_x_axis_zoom_idx(state, new_value) {
    state.x_zoom_level_idx = new_value;
  },
  set_y_axis_zoom_levels(state, new_value) {
    state.y_zoom_levels = new_value;
  },
  set_y_axis_zoom_idx(state, new_value) {
    state.y_zoom_level_idx = new_value;
  },
  set_barcode_manual_mode(state, new_value) {
    state.barcode_manual_mode = new_value;
  },
};
