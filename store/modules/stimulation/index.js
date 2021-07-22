import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = () => ({
  selected_wells: [],
  protocol_list: [
    { letter: "", color: "", label: "Create New" },
    {
      // for testing and building other fxns
      letter: "A",
      color: "#118075",
      label: "Tester",
      protocol: {
        name: "Tester",
        stimulation_type: "V",
        end_delay_duration: 20,
        time_unit: "milliseconds",
        pulses: [
          {
            phase_one_duration: 15,
            phase_one_charge: 0,
            interpulse_duration: 0,
            phase_two_duration: 0,
            phase_two_charge: 0,
          },
          {
            phase_one_duration: 20,
            phase_one_charge: 0,
            interpulse_duration: 0,
            phase_two_duration: 0,
            phase_two_charge: 0,
          },
        ],
        detailed_pulses: [
          {
            type: "Delay",
            src: "/delay-tile.png",
            nested_protocols: [],
            repeat: { color: "d822f9", number_of_repeats: 0 },
            settings: {
              phase_one_duration: 15,
              phase_one_charge: 0,
              interpulse_duration: 0,
              phase_two_duration: 0,
              phase_two_charge: 0,
            },
          },
        ],
      },
    },
  ],
  protocol_assignments: {},
  protocol_editor: {
    name: "",
    stimulation_type: "V",
    end_delay_duration: 0,
    time_unit: "seconds",
    pulses: [],
    detailed_pulses: [],
  },
  current_assignment: { letter: "", color: "" },
  x_axis_values: [],
  y_axis_values: [],
  repeat_colors: {},
  x_axis_scale: 100,
  y_axis_scale: 500,
  delay_blocks: [],
  stim_status: false,
  edit_mode: { status: false, protocol: "" },
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
