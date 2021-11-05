import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  /* Matching the Rtl
     customer_account_ids:
       - uuid: 73f52be0-368c-42d8-a1fd-660d49ba5604
         nickname: CuriBio
         pass_key:
         user_account_ids:
           - uuid: 94010301-8cf6-4520-a28c-fe426776b745
             nickname: Tanner
         active_customer_account_index: 0
         active_user_account_index: 0
  */
  user_details: {
    user_id: null,
    uuid: null,
    nickname: null,
  },
  customer_details: {
    cust_idx: null,
    cust_id: null,
    pass_key: null,
    nickname: null,
    user_ids: [] /* This contains objects of user_details */,
  },
  auto_upload: true,
  auto_delete: false,
  customer_account_ids: [],
  customer_index: null,
  user_index: null,
  log_path: "C:\\Users\\<username>\\AppData\\Roaming\\MantarrayController\\logs_flask",
  file_count: 0,
  max_file_count: 0,
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
