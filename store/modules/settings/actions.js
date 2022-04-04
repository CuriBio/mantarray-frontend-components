import { call_axios_get_from_vuex, post_firmware_update_confirmation } from "@/js_utils/axios_helpers.js";

export default {
  async update_settings(context) {
    const { customer_index, customer_account_ids, auto_upload, auto_delete } = this.state.settings;
    const { cust_id, pass_key, user_account_id } = customer_account_ids[customer_index];

    const url = "http://localhost:4567/update_settings";
    const params = {
      customer_account_id: cust_id,
      customer_pass_key: pass_key,
      user_account_id: user_account_id,
      auto_upload,
      auto_delete,
    };

    const response = await call_axios_get_from_vuex(url, context, params);
    return response;
  },
  async send_firmware_update_confirmation(context, update_accepted) {
    const status = update_accepted ? "accepted" : "declined";
    console.log(`User ${status} firmware update`); // allow-log
    return await post_firmware_update_confirmation(update_accepted);
  },
};
