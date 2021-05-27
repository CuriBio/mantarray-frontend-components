import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = () => ({
  // is_active: false,
  // list_of_available_protocols: [],
  // active_stimulation_settings: {},
  // new_protocol: {},
  selected_wells: [0, 1, 2]
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};


// alphabet: [
      //   'A',
      //   'B',
      //   'C',
      //   'D',
      //   'E',
      //   'F',
      //   'G',
      //   'H',
      //   'I',
      //   'J',
      //   'K',
      //   'L',
      //   'M',
      //   'N',
      //   'O',
      //   'P',
      //   'Q',
      //   'R',
      //   'S',
      //   'T',
      //   'U',
      //   'V',
      //   'W',
      //   'X',
      //   'Y',
      //   'Z',
      // ],