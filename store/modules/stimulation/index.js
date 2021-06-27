import mutations from "./mutations";
import getters from "./getters";

const state = () => ({
  selected_wells: [],
  protocol_list: hardcoded_protocols,
  protocol_assignments: {},
  new_protocol: {
    name: "",
    stimulation_type: "Voltage Controlled Stimulation",
    stop_requirement: "Until Stopped",
    frequency: "",
    time_unit: "seconds",
    waveform_list: [],
  },
  delete_protocol: false,
  x_axis_points: [],
  y_axis_points: [],
  repeat_colors: {},
  x_axis_scale: 100,
  y_axis_scale: 10,
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};

const hardcoded_protocols = [
  { letter: "", color: "", label: "Create New" },
  { letter: "A", color: "#83c0b3", label: "test_A" },
  { letter: "B", color: "#45847b", label: "test_B" },
  { letter: "C", color: "#df6147", label: "test_C" },
  { letter: "D", color: "#f0a061", label: "test_D" },
  { letter: "E", color: "#24524b", label: "" },
  { letter: "F", color: "#133836", label: "" },
  { letter: "G", color: "#f9d78c", label: "" },
  { letter: "H", color: "#bd3532", label: "" },
  { letter: "I", color: "#871d28", label: "" },
];
