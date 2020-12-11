import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  /* Matching the Rtl
     customer_account_ids:
  - uuid: 73f52be0-368c-42d8-a1fd-660d49ba5604
    nickname: CuriBio
    api_key:
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
    cust_id: null,
    uuid: null,
    api_key: null,
    nickname: null,
    user_ids: [] /* This contains objects of user_details */,
  },
  customer_account_ids: [],
  customer_index: null,
  user_index: null,
  log_path:
    "C:\\Users\\Mantarray\\AppData\\Roaming\\MantarrayController\\logs_flask",
};

const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
