// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  status_id(state) {
    return state.status_uuid;
  },
  simulation_status(state) {
    return state.simulation_mode;
  },
};
