export default {
  customer_account_ids(state) {
    return state.customer_account_ids;
  },
  user_details(state) {
    return state.customer_account_ids[state.customer_index].user_ids[
      state.user_index
    ];
  },
  customer_details(state) {
    return state.customer_account_ids[state.customer_index];
  },
  customer_index(state) {
    return state.customer_index;
  },
  user_index(state) {
    return state.user_index;
  },
  user_ids_for_selected_customer_account(state) {
    return state.customer_account_ids[state.customer_index].user_ids;
  },
  temp_customer_details(state) {
    return state.customer_details;
  },
  temp_user_details(state) {
    return state.user_details;
  },
  number_of_customer_account_ids(state) {
    return state.customer_account_ids.length;
  },
  number_of_user_account_ids(state) {
    return state.customer_account_ids[state.customer_index].user_ids.length;
  },
};
