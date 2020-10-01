// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  set_status_ping_interval_id(state, new_id) {
    state.status_ping_interval_id = new_id;
  },
  stop_status_pinging(state) {
    if (state.status_ping_interval_id !== null) {
      clearInterval(state.status_ping_interval_id);
      state.status_ping_interval_id = null;
    }
  },
  set_status_uuid(state, new_id) {
    state.status_uuid = new_id;
  },
  set_simulation_status(state, new_id) {
    state.simulation_mode = new_id;
  },
};
