import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";

export default {
  async update_settings(context) {
    const { customer_index, customer_account_ids, auto_upload, auto_delete } = this.state.settings;
    const customer_account_uuid = customer_account_ids[customer_index].api_key;

    const payload = {
      baseurl: "http://localhost:4567",
      endpoint: "update_settings",
      customer_account_uuid,
      auto_upload,
      auto_delete
    };
    const response = await this.dispatch("settings/call_update_axios_request", payload);
    return response;
  },
  async call_update_axios_request(context, payload) {
    const { auto_delete, auto_upload, baseurl, endpoint, customer_account_uuid } = payload;
    const whole_url = `${baseurl}/${endpoint}?customer_account_uuid=${customer_account_uuid}&auto_upload=${auto_upload}&auto_delete=${auto_delete}`;
    const response = await call_axios_get_from_vuex(whole_url, context);
    console.log(response);
    return response;
  }
};
