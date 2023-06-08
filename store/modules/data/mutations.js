// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { MAX_NUM_DATAPOINTS_FOR_MEAN } from "@/store/modules/heatmap/enums";
import { TWITCH } from "@/store/modules/data/enums";

export default {
  set_plate_waveforms(state, new_value) {
    state.plate_waveforms = [...new_value];
  },
  clear_plate_waveforms(state) {
    for (let i = 0; i < state.plate_waveforms.length; i++) {
      state.plate_waveforms[i] = { x_data_points: [], y_data_points: [] };
    }
  },
  set_heatmap_values(state, new_value) {
    state.heatmap_values = new_value;
  },
  set_metric_data(state, new_value) {
    state.heatmap_values[new_value.name].data.forEach((item, idx) => {
      item.push(new_value.data[idx]);
    });
  },
  append_metric_data(state, new_values) {
    const heatmap_copy = JSON.parse(JSON.stringify(state.heatmap_values));
    for (const well_idx in new_values) {
      if (new_values[well_idx] !== undefined) {
        const new_well_values = new_values[well_idx];
        for (const metric_name in heatmap_copy) {
          if (new_well_values[TWITCH.METRIC_IDS[metric_name]] !== undefined) {
            heatmap_copy[metric_name].data[well_idx] = heatmap_copy[metric_name].data[well_idx]
              .concat(new_well_values[TWITCH.METRIC_IDS[metric_name]])
              .slice(-MAX_NUM_DATAPOINTS_FOR_MEAN);
          }
        }
      }
    }

    state.heatmap_values = { ...heatmap_copy };
  },
  clear_heatmap_values(state) {
    for (const metric_name in state.heatmap_values) {
      if (state.heatmap_values[metric_name].data !== undefined) {
        const num_wells = state.heatmap_values[metric_name].data.length;
        state.heatmap_values[metric_name].data = [...Array(num_wells)].map((e) => Array(0));
      }
    }
  },
  set_stim_waveforms(state, new_value) {
    state.stim_waveforms = new_value;
  },
  clear_stim_waveforms(state) {
    for (let i = 0; i < state.stim_waveforms.length; i++) {
      state.stim_waveforms[i] = { x_data_points: [], y_data_points: [] };
      state.stim_fill_assignments[i] = [];
      state.last_protocol_flag[i] = [];
    }
  },
  set_fill_colors(state, payload) {
    const { stim_fill_colors, well } = payload;
    const copy = state.stim_fill_colors; // required to be reactive
    copy[well] = stim_fill_colors;
    state.stim_fill_colors = { ...copy };
  },
  set_stimulator_circuit_statuses(state, stimulator_statuses) {
    state.stimulator_circuit_statuses = [...stimulator_statuses];
  },
  set_h5_warning(state) {
    state.h5_warning = !state.h5_warning;
  },
  set_recording_snapshot_data(state, data) {
    state.recording_snapshot_data = [...data];
  },
  set_recording_snapshot_error(state, msg) {
    state.recording_snapshot_error = msg;
  },
};
