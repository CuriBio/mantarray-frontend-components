// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { TextValidation } from "@/js_utils/text_validation.js";
const TextValidation_plate_barcode = new TextValidation("plate_barcode");

export default {
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
  set_barcode_number(state, new_value) {
    const result = TextValidation_plate_barcode.validate(new_value);
    if (result == "") {
      state.is_valid_barcode = true;
    } else {
      state.is_valid_barcode = false;
    }
    state.barcode = new_value;
  },
  set_barcode_valid_manual_mode(state, new_value) {
    state.is_valid_barcode = new_value;
  },
  set_barcode_number_manual_mode(state, new_value) {
    state.barcode = new_value;
  },
  set_tooltips_delay(state, new_value) {
    state.tooltips_delay = new_value;
  },
  set_five_min_timer(state) {
    setTimeout(() => {
      if (state.five_min_warning === false) state.five_min_warning = true;
      else if (state.five_min_warning === null) state.five_min_warning = false;
    }, 5 * 60e3);
  },
  set_one_min_timer(state) {
    setTimeout(() => {
      if (state.one_min_warning === false) {
        state.one_min_warning = true;
        state.five_min_warning = false;
      } else if (state.one_min_warning === null) state.one_min_warning = false;
    }, 1 * 60e3);
  },
};
