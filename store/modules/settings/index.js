import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { ERRORS } from "./enums";

const default_state = {
  auto_upload: false,
  auto_delete: false,
  run_recording_snapshot_default: true,
  user_account: { customer_id: "", username: "", password: "" },
  stored_customer_id: null,
  stored_usernames: [],
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
  shutdown_error_status: "",
  installer_link: null,
  beta_2_mode: false,
  software_update_available: false,
  firmware_update_available: false,
  firmware_update_dur_mins: null,
  allow_sw_update_install: false,
  user_cred_input_needed: false,
  confirmation_request: false,
  pulse3d_versions: ["Error"],
  pulse3d_version_selection_index: 0,
  job_limit_reached: false,
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
  ERRORS,
};
