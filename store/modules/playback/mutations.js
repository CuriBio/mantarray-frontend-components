// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

export default {
  set_enable_stim_controls(state, new_value) {
    state.enable_stim_controls = new_value;
  },
  set_loop_playback(state, new_value) {
    state.loop_playback = new_value;
  },
  set_x_time_index(state, new_value) {
    state.x_time_index = new_value;
  },
  increment_x_time_index(state, value_to_add) {
    state.x_time_index += value_to_add;
  },
  set_playback_state(state, new_value) {
    state.playback_state = new_value;
  },
  set_recording_start_time(state, new_value) {
    state.recording_start_time = new_value;
  },
  stop_recording(state) {
    state.recording_start_time = 0;
  },
  stop_playback_progression(state) {
    if (state.playback_progression_interval_id !== null) {
      clearInterval(state.playback_progression_interval_id);
      state.playback_progression_interval_id = null;
    }
  },
  mark_timestamp_of_beginning_of_progression(state) {
    state.timestamp_of_beginning_of_progression = performance.now();
  },
  set_num_milliseconds_to_fast_forward_if_delayed(state, new_value) {
    state.num_milliseconds_to_fast_forward_if_delayed = new_value;
  },
  set_playback_progression_interval_id(state, new_value) {
    state.playback_progression_interval_id = new_value;
  },
  set_barcode(state, { type, new_value, is_valid }) {
    state.barcodes[type].value = new_value;
    state.barcodes[type].valid = is_valid;
  },
  set_tooltips_delay(state, new_value) {
    state.tooltips_delay = new_value;
  },
  set_barcode_warning(state, bool) {
    state.barcode_warning = bool;
  },
  set_data_analysis_state(state, new_state) {
    state.data_analysis_state = new_state;
  },
  set_start_recording_from_stim(state, bool) {
    state.start_recording_from_stim = bool;
  },
  set_is_recording_snapshot_running(state, bool) {
    state.is_recording_snapshot_running = bool;
  },
};
