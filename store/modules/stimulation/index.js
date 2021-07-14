import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = () => ({
  selected_wells: [],
  protocol_list: [
    { letter: "", color: "", label: "Create New" },
    { letter: "A", color: "#118075", label: "Tester" },
  ],
  protocol_assignments: {},
  new_protocol: {
    name: "",
    stimulation_type: "Voltage Controlled Stimulation",
    end_delay_duration: 0,
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
