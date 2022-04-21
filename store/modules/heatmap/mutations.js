export default {
  set_well_selection_statuses(state, new_statuses) {
    state.well_selection_statuses = new_statuses;
  },
  set_selected_wells(state, new_selection) {
    state.selected_wells = new_selection;
  },
  set_display_option(state, new_value) {
    state.display_option = new_value;
  },
  set_display_option_idx(state, new_value) {
    state.display_option_idx = new_value;
  },
  set_auto_scale(state, bool) {
    state.auto_scale = bool;
  },
};
