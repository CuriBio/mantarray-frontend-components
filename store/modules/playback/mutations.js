// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
import { TextValidation } from "@/js_utils/text_validation.js";
import { ENUMS } from "./enums";
const TextValidation_plate_barcode = new TextValidation("plate_barcode");

export default {
  set_enable_stim_controls(state, new_value) {
    // only enable if stim barcode is valid too
    if (new_value && state.barcodes.stim_barcode.valid) state.enable_stim_controls = new_value;
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
  set_barcode(state, { type, new_value }) {
    const result = TextValidation_plate_barcode.validate(new_value);
    const is_valid = result == "";
    state.barcodes[type].value = new_value;
    state.barcodes[type].valid = is_valid;
    // enable controls only if vaid barcode and device is not in need calibration state
    state.enable_stim_controls =
      type == "stim_barcode" &&
      is_valid &&
      ![
        ENUMS.PLAYBACK_STATES.NEEDS_CALIBRATION,
        ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED,
        ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT,
      ].includes(state.playback_state);
  },
  set_tooltips_delay(state, new_value) {
    state.tooltips_delay = new_value;
  },
  set_five_min_warning(state, bool) {
    state.five_min_warning = bool;
  },
  set_one_min_warning(state, bool) {
    state.one_min_warning = bool;
  },
};
