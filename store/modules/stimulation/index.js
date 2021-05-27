import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = () => ({
  // is_active: false,
  // list_of_available_protocols: [],
  // active_stimulation_settings: {},
  // new_protocol: {},
  selected_wells: []
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};


// const protocol_options: {
//         'A',
//         'B',
//         'C',
//         'D',
//         'E',
//         'F',
//         'G',
//         'H',
//         'I',
//         'J',
//         'K',
//         'L',
//         'M',
//         'N',
//         'O',
//         'P',
//         'Q',
//         'R',
//         'S',
//         'T',
//         'U',
//         'V',
//         'W',
//         'X',
//         'Y',
//         'Z',
// },