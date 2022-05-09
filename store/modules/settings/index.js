import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  customer_details: {
    cust_idx: null,
    cust_id: null,
    pass_key: null,
    user_account_id: null,
  },
  auto_upload: false,
  auto_delete: false,
  customer_account_ids: [],
  customer_index: null,
  log_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\logs_flask",
  root_downloads_path: "C:\\Users\\username\\Downloads",
  root_recording_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\recordings",
  data_analysis_directory: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\time_force_data",
  recordings_list: [],
  failed_recordings: [],
  selected_recordings_for_analysis: [],
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
  confirmation_request: false,
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
