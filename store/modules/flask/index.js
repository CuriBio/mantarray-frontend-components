// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { STATUS } from "./enums";

const default_state = {
  port: 4567, // http://localhost:4567/
  status_ping_interval_id: null,
  status_uuid: STATUS.MESSAGE.SERVER_BOOTING_UP,
  simulation_mode: false,
  barcode_manual_mode: false,
  ignore_next_system_status_if_matching_this_status: null,
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
  STATUS,
};
