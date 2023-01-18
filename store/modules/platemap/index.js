// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const blank_map = () => JSON.parse(JSON.stringify([{ name: "Select Treatment", wells: [], color: "none" }]));

const default_state = {
  selected_wells: [],
  well_treatments: blank_map(),
  stored_platemaps: [{ name: "Create New Map", map: blank_map() }],
  current_platemap_name: null,
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
