// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  x_zoom_levels(state) {
    return state.x_zoom_levels;
  },
  x_zoom_level_idx(state) {
    return state.x_zoom_level_idx;
  },
  y_axis_zoom_levels(state) {
    return state.y_zoom_levels;
  },
  y_axis_zoom_idx(state) {
    return state.y_zoom_level_idx;
  },
};
