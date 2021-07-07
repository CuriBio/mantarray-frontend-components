import { STATUS } from "./enums"; // Eli (6/11/20): Testcafe doesn't understand the '@' to resolve to the root directory, so have to explicitly specify full path

export const system_status_when_server_initializing_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.SERVER_STILL_INITIALIZING}`
);

export const system_status_when_server_ready_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.SERVER_READY}`
);

export const system_status_when_initializing_instrument_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.INITIALIZING_INSTRUMENT}`
);

export const system_status_when_buffering_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.BUFFERING}`
);

export const system_status_when_calibrated_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.CALIBRATED}`
);

export const system_status_when_calibrating_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.CALIBRATING}`
);

export const system_status_when_recording_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.RECORDING}`
);

export const system_status_when_live_view_active_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.LIVE_VIEW_ACTIVE}`
);

export const system_status_when_calibration_needed_regexp = new RegExp(
  `/system_status\\?current_vuex_status_uuid=${STATUS.MESSAGE.CALIBRATION_NEEDED}`
);

export const system_status_regexp = new RegExp(`/system_status`);

export const all_mantarray_commands_regexp = new RegExp(
  "(start_recording)|(stop_recording)|(start_managed_acquisition)|(stop_managed_acquisition)|(start_calibration)"
);

export const get_available_data_regex = new RegExp(`/get_available_data?.*`);
