import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = () => ({
  selected_wells: [],
  protocol_list: [{ letter: "", color: "", label: "Create New" }],
  protocol_assignments: {},
  protocol_editor: {
    name: "",
    stop_setting: "Stimulate Until Stopped",
    stimulation_type: "C",
    rest_duration: 0,
    time_unit: "milliseconds",
    pulses: [],
    detailed_pulses: [],
  },
  current_assignment: { letter: "", color: "" },
  x_axis_values: [],
  y_axis_values: [],
  repeat_colors: {},
  y_axis_scale: 120,
  delay_blocks: [],
  stim_status: false,
  x_axis_time_idx: 0,
  edit_mode: { status: false, protocol: "", label: "", color: "" },
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
