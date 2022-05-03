export default {
  set_log_path(state, new_value) {
    state.log_path = new_value;

    let username;
    if (new_value.includes("\\")) username = new_value.split("\\")[2];
    else username = new_value.split("/")[2];

    state.root_downloads_path = `C:\\Users\\${username}\\Downloads`;
  },
  set_shutdown_error_message(state, new_value) {
    state.shutdown_error_message = new_value;
  },
  set_customer_account_ids(state, new_value) {
    state.customer_account_ids = new_value;
  },
  set_customer_details(state, new_value) {
    state.customer_details = new_value;
  },
  set_customer_index(state, new_value) {
    state.customer_index = new_value;
  },
  set_file_count(state) {
    state.file_count += 1;
  },
  set_total_file_count(state) {
    state.total_file_count += 1;
  },
  set_auto_upload(state, new_value) {
    state.auto_upload = new_value;
  },
  set_auto_delete(state, new_value) {
    state.auto_delete = new_value;
  },
  reset_to_default(state) {
    state.auto_upload = false;
    state.customer_index = null;
    state.auto_delete = false;
  },
  set_upload_error(state, new_value) {
    state.upload_error = new_value;
  },
  set_file_name(state, file_name) {
    state.total_uploaded_files = [...state.total_uploaded_files, file_name];
    if (state.total_uploaded_files.length > state.total_file_count)
      state.total_file_count = state.total_uploaded_files.length;
  },
  set_beta_2_mode(state, bool) {
    state.beta_2_mode = bool;
  },
  set_software_update_available(state, bool) {
    state.software_update_available = bool;
  },
  set_firmware_update_available(state, update_info) {
    state.firmware_update_available = update_info.firmware_update_available;
    state.firmware_update_dur_mins = update_info.channel_fw_update ? 5 : 1;
  },
  set_allow_sw_update_install(state, bool) {
    state.allow_sw_update_install = bool;
  },
  set_user_cred_input_needed(state, bool) {
    state.user_cred_input_needed = bool;
  },
  set_recording_dirs(state, { root_recording_path, recordings_list }) {
    state.root_recording_path = root_recording_path;
    state.recordings_list = [...recordings_list];
  },
  set_data_analysis_directory(state, directory) {
    state.data_analysis_directory = directory;
  },
};
