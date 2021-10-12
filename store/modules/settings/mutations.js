export default {
  set_customer_account_ids(state, new_value) {
    state.customer_account_ids = new_value;
  },
  set_user_details(state, new_value) {
    state.user_details = new_value;
  },
  set_customer_details(state, new_value) {
    state.customer_details = new_value;
  },
  set_customer_index(state, new_value) {
    state.customer_index = new_value;
  },
  set_user_index(state, new_value) {
    state.user_index = new_value;
  },
  set_file_count(state, new_value) {
    state.file_count = new_value;
  },
  set_max_file_count(state, new_value) {
    state.max_file_count = new_value;
  },
  set_auto_upload(state, new_value) {
    state.auto_upload = new_value;
  },
  set_auto_delete(state, new_value) {
    state.auto_delete = new_value;
  },
  reset_to_default(state) {
    state.auto_upload = true;
    state.customer_index = null;
    state.auto_delete = false;
  }
};
