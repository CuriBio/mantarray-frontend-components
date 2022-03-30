// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  well_selection_statuses(state) {
    return state.well_selection_statuses;
  },
  selected_wells(state) {
    return state.selected_wells;
  },
  display_option(state) {
    return state.display_option;
  },
  display_option_idx(state) {
    return state.display_option_idx;
  },
};
