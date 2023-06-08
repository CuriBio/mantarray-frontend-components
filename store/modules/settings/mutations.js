import { ERRORS } from "./enums";

export default {
  set_log_path(state, new_value) {
    state.log_path = new_value;

    const username = new_value.includes("\\") ? new_value.split("\\")[2] : new_value.split("/")[2];
    state.root_downloads_path = `C:\\Users\\${username}\\Downloads`;
  },
  set_shutdown_error_message(state, new_value) {
    state.shutdown_error_message = new_value;
  },
  set_shutdown_error_status(state, { error_type, latest_compatible_sw_version }) {
    let error = `${ERRORS[error_type]}.`;
    if (latest_compatible_sw_version) {
      state.installer_link = `https://downloads.curibio.com/software/mantarray/MantarrayController-Setup-prod-${latest_compatible_sw_version}.exe`;
      error += " Please download the installer for the correct version here:";
    } else {
      state.installer_link = null;
      error += " Mantarray Controller is about to shutdown.";
    }
    state.shutdown_error_status = error;
    state.shutdown_error_message = error;
  },
  set_user_account(state, new_value) {
    state.user_account = { ...new_value };
  },
  set_stored_accounts(state, { customer_id, usernames }) {
    state.stored_customer_id = customer_id;
    state.user_account.customer_id = customer_id;

    state.stored_usernames = usernames;
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
  set_upload_error(state, type) {
    state.upload_error = type;
  },
  set_file_name(state, file_name) {
    state.total_uploaded_files = [...state.total_uploaded_files, file_name];
    if (state.total_uploaded_files.length > state.total_file_count)
      state.total_file_count = state.total_uploaded_files.length;
  },
  set_beta_2_mode(state, bool) {
    state.beta_2_mode = bool;
  },
  set_pulse3d_versions(state, versions) {
    state.pulse3d_versions = versions;
  },
  set_pulse3d_version_selection_index(state, idx) {
    state.pulse3d_version_selection_index = idx;
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
  set_failed_recordings(state, recordings) {
    state.failed_recordings = [...recordings];
  },
  set_selected_recordings(state, recordings) {
    state.selected_recordings_for_analysis = [...recordings];
  },
  set_confirmation_request(state, bool) {
    state.confirmation_request = bool;
  },
  set_recording_snapshot_state(state, bool) {
    state.run_recording_snapshot_default = bool;
  },
  set_job_limit_reached(state, bool) {
    state.job_limit_reached = bool;
    if (bool) {
      state.auto_upload = false;
    }
  },
};
