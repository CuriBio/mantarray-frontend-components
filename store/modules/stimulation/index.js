import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = () => ({
  selected_wells: [],
  protocol_list: hardcoded_protocols,
  protocol_assignments: {},
  new_protocol: {
    name: "",
    stimulation_type: "Voltage Controlled Stimulation",
    stop_requirement: "Until Stopped",
    frequency: 0,
    time_unit: "seconds",
    waveform_order: [],
  },
  x_axis_values: [],
  y_axis_values: [],
  repeat_colors: {},
  x_axis_scale: 100,
  y_axis_scale: 10,
  delay_blocks: [],
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

const hardcoded_protocols = [
  { letter: "", color: "", label: "Create New" },
  { letter: "A", color: "#83c0b3", label: "test_A" },
  { letter: "B", color: "#45847b", label: "test_B" },
  { letter: "C", color: "#df6147", label: "test_C" },
  { letter: "D", color: "#f0a061", label: "test_D" },
  { letter: "E", color: "#871d28", label: "" },
  { letter: "F", color: "#24524b", label: "" },
  { letter: "G", color: "#133836", label: "" },
  { letter: "H", color: "#f9d78c", label: "" },
  { letter: "I", color: "#bd3532", label: "" },
];
