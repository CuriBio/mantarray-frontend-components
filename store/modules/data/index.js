// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const waveforms_entry_template = { x_data_points: [], y_data_points: [] };

const maximum_number_of_wells_in_any_plate = 96;

const default_state = {
  // plate_waveforms: 24 element array. each element corresponds to a well in the plate  (all x/y data points for the whole recording)
  plate_waveforms: [],
  heatmap_values: {
    "Twitch Force": { data: [[0]], range_min: 0, range_max: 100 },
    "Twitch Frequency": { data: [[100]], range_min: 0, range_max: 100 },
    // "Twitch Period": { data: [], range_min: 0, range_max: 100 },
    // "Twitch Width 80": { data: [], range_min: 0, range_max: 100 },
    // "Contraction Velocity": { data: [], range_min: 0, range_max: 100 },
    // "Relaxation Velocity": { data: [], range_min: 0, range_max: 100 },
  },

  // Tanner (10/29/21): the data stored here aren't actually waveforms yet, but will be in the future
  stim_waveforms: [],
  stim_fill_colors: {},
  stim_fill_assignments: [],
  last_protocol_flag: [],
  stimulator_circuit_statuses: [2, 6, 10],
};

for (let i = 0; i < maximum_number_of_wells_in_any_plate; i++) {
  default_state.plate_waveforms.push(waveforms_entry_template);
  default_state.stim_waveforms.push(waveforms_entry_template);
  default_state.stim_fill_assignments.push([]);
  default_state.last_protocol_flag.push([]);
}

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
