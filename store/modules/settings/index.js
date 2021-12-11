import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  user_details: {
    user_id: null,
    uuid: null,
    username: null,
  },
  customer_details: {
    cust_idx: null,
    cust_id: null,
    pass_key: null,
    username: null,
    user_ids: [] /* This contains objects of user_details */,
  },
  auto_upload: true,
  auto_delete: false,
  customer_account_ids: [],
  customer_index: null,
  user_index: null,
  log_path: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\logs_flask",
  base_downloads_path: "C:\\Users\\username\\Downloads",
  file_count: 0,
  total_file_count: 0,
  upload_error: false,
  total_uploaded_files: [],
  shutdown_error_message: "Mantarray software is about to shut down.",
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
