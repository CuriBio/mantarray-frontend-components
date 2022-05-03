import { call_axios_get_from_vuex, call_axios_post_from_vuex } from "@/js_utils/axios_helpers.js";

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
  async send_firmware_update_confirmation(_, update_accepted) {
    const status = update_accepted ? "accepted" : "declined";
    console.log(`User ${status} firmware update`); // allow-log

    const url = `/firmware_update_confirmation?update_accepted=${update_accepted}`;
    return await call_axios_post_from_vuex(url);
  },
  async get_recording_dirs({ commit }) {
    const url = "http://localhost:4567/get_recordings_list";
    const response = await call_axios_get_from_vuex(url);

    await commit("set_recording_dirs", response.data);
  },
};
