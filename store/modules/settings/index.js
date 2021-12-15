import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  customer_details: {
    cust_idx: null,
    cust_id: null,
    pass_key: null,
    username: null,
  },
  auto_upload: true,
  auto_delete: false,
  customer_account_ids: [],
  customer_index: null,
  log_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\logs_flask",
  base_downloads_path: "C:\\Users\\username\\Downloads",
  file_count: 0,
  total_file_count: 0,
  upload_error: false,
  total_uploaded_files: [],
  shutdown_error_message: "Mantarray software is about to shut down.",
  beta_2_mode: false,
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
