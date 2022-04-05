// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { append_well_data, find_closest_array_idx } from "../../../js_utils/waveform_data_formatter.js";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";

export default {
  async append_plate_waveforms({ dispatch, commit, state }, new_value) {
    const appended_waveforms = append_well_data(state.plate_waveforms, new_value);
    commit("set_plate_waveforms", appended_waveforms);

    appended_waveforms.map((x, idx) => {
      const { x_data_points } = x;
      const payload = {
        x: x_data_points[x_data_points.length - 1],
        idx,
      };
      commit("update_fill_assignments", payload);
    });

    dispatch("remove_old_waveform_data");
  },
  remove_old_waveform_data({ rootState }) {
    const { waveform, playback, data } = rootState;
    const max_x_min_value = playback.x_time_index - waveform.x_zoom_levels[0].x_scale;
    // remove time points indices that are older than the x min at max zoom out
    data.plate_waveforms.map((well) => {
      const idx_to_splice = find_closest_array_idx(well.x_data_points, max_x_min_value);
      well.x_data_points.splice(0, idx_to_splice - 2);
      well.y_data_points.splice(0, idx_to_splice - 2);
    });
  },
  async get_data_action_context(context) {
    // useful for testing actions
    return context;
  },
  async append_stim_waveforms({ state, dispatch }, new_values) {
    for (const well_idx in new_values) {
      if (new_values[well_idx] !== undefined && state.plate_waveforms[well_idx] !== undefined) {
        // real Y values not actually used yet, just need to draw a straight vertical line at each new x value and connect the points at a Y value out of the max zoom window
        const previous_time = state.last_protocol_flag[well_idx];
        const new_well_values = new_values[well_idx][0];
        const protocol_flags = new_values[well_idx][1];

        if (previous_time[0]) {
          new_well_values.unshift(previous_time[0]);
          protocol_flags.unshift(previous_time[1]);
        }

        let idx = 0;

        while (idx < new_well_values.length) {
          const x = new_well_values[idx];
          const next_x = new_well_values[idx + 1] ? new_well_values[idx + 1] : x;
          /*
              Protects against long subprotocols.
              Second x timepoint is a filler value and will be replaced in ContinuousWaveform with last tissue data timepoint
              Can't replace it here with tissue datapoint because it needs to be updated in real time, this only gets called when a new subprotocol comes in
          */

          state.stim_waveforms[well_idx].x_data_points.push(x);
          state.stim_waveforms[well_idx].y_data_points.push(101000);

          if (next_x || new_well_values.length == 1 || protocol_flags[idx] == 255)
            state.stim_fill_assignments[well_idx].push([
              protocol_flags[idx],
              [
                [x, 101000],
                [next_x, 101000],
              ],
            ]);
          else state.last_protocol_flag[well_idx] = [x, protocol_flags[idx]];

          idx++;
        }
      }
    }
    dispatch("remove_old_stim_data");
  },
  remove_old_stim_data({ rootState }) {
    const { waveform, playback, data } = rootState;
    const max_x_min_value = playback.x_time_index - waveform.x_zoom_levels[0].x_scale;

    data.stim_waveforms.map((well, well_idx) => {
      // second conditional protects against long subprotocols
      // don't want to delete timepoint if a subprotocol is still active and it's the last index in array
      data.stim_fill_assignments[well_idx] = data.stim_fill_assignments[well_idx].filter(
        (x, idx) => x[1][1][0] >= max_x_min_value || idx == data.stim_fill_assignments[well_idx].length - 1
      );

      const idx_to_splice = find_closest_array_idx(well.x_data_points, max_x_min_value);
      well.x_data_points.splice(0, idx_to_splice - 2);
      well.y_data_points.splice(0, idx_to_splice - 2);
    });
  },
  check_stimulator_circuit_statuses({ commit }, { stimulator_statuses }) {
    // incoming_array = {stimulator_statuses: [stimulator_status_0, stimulator_status_1, ...]}

    // check if statuses include a short circuit status and set error status
    if (stimulator_statuses.includes("short"))
      this.commit("stimulation/set_stim_status", STIM_STATUS.SHORT_CIRCUIT_ERR);
    else {
      // else set the stim status that other components watch, only save indices
      const filtered_statuses = stimulator_statuses.filter((idx, status) => {
        if (status == "open") return idx;
      });
      commit("set_stimulator_circuit_statuses", filtered_statuses);
      // if no errors to report, go straight to stim ready status, else notify user of errors handled in StatusBar
      this.commit(
        "stimulation/set_stim_status",
        filtered_statuses.length > 0 ? STIM_STATUS.CONFIG_CHECK_COMPLETE : STIM_STATUS.READY
      );
    }
  },
};
