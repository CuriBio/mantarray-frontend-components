export default {
  add_selected_wells({ commit }, array_of_wells) {
    commit("add_selected_wells", array_of_wells);
  },
  remove_selected_wells({ commit }, array_of_wells) {
    commit("remove_selected_Wells", array_of_wells);
  }
};
