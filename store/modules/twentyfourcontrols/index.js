import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  is_quadrant: [0, 1, 4, 5, 8, 9], // Settings default quadrant 1
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
