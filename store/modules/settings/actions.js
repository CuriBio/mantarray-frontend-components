import { call_axios_get_from_vuex, call_axios_post_from_vuex } from "@/js_utils/axios_helpers.js";

export default {
  async update_settings(context) {
    const {
      active_user_index,
      user_accounts,
      auto_upload,
      auto_delete,
      pulse3d_version_selection_index,
      pulse3d_versions,
    } = this.state.settings;
    const { customer_id, user_password, user_name } = user_accounts[active_user_index];

    const selected_pulse3d_version = pulse3d_versions[pulse3d_version_selection_index];

    const url = "http://localhost:4567/update_settings";
    const params = {
      customer_id,
      user_name,
      user_password,
      auto_upload,
      auto_delete,
      pulse3d_version: selected_pulse3d_version,
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
    const url = "http://localhost:4567/get_recordings";
    const response = await call_axios_get_from_vuex(url);
    await commit("set_recording_dirs", response.data);
  },
};
