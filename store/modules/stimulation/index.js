import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const default_state = {
  is_active: false,
  list_of_available_protocols: [],
  active_stimulation_settings: {},
  new_protocol: {},
  selected_wells: [],
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
