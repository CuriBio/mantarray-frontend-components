import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  auto_upload: false,
  auto_delete: false,
  user_accounts: [],
  stored_customer_id: null,
  active_user_index: null,
  log_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\logs_flask",
  root_downloads_path: "C:\\Users\\username\\Downloads",
  root_recording_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\recordings",
  data_analysis_directory: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\time_force_analyses",
  recordings_list: [],
  file_count: 0,
  total_file_count: 0,
  upload_error: false,
  total_uploaded_files: [],
  shutdown_error_message: "Mantarray software is about to shut down.",
  beta_2_mode: false,
  software_update_available: false,
  firmware_update_available: false,
  firmware_update_dur_mins: null,
  allow_sw_update_install: false,
  user_cred_input_needed: false,
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
