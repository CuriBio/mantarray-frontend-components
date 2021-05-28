import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = () => ({
  selected_wells: [],
  protocol_list: {},
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

// const hardcoded_protocols = {
//   A: "#871d28",
//   B: "#bd3532",
//   C: "#df6147",
//   D: "#f0a061",
//   E: "#24524b",
//   F: "#133836",
//   G: "#f9d78c",
//   H: "#45847b",
//   I: "#83c0b3"
// };
