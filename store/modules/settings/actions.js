import { call_axios_get_from_vuex, call_axios_post_from_vuex } from "@/js_utils/axios_helpers.js";

export default {
  async update_settings(context, user_details) {
    const { auto_upload, auto_delete, pulse3d_focus_idx } = user_details;
    const selected_pulse3d_version = this.state.settings.pulse3d_versions[pulse3d_focus_idx];

    const url = "http://localhost:4567/update_settings";
    const params = {
      auto_upload,
      auto_delete,
      pulse3d_version: selected_pulse3d_version,
    };

    const { status } = await call_axios_get_from_vuex(url, context, params);
    if (status === 204) {
      this.commit("settings/set_auto_upload", auto_upload);
      this.commit("settings/set_auto_delete", auto_delete);
      this.commit("settings/set_pulse3d_version_selection_index", pulse3d_focus_idx);
    }
  },
  async login_user(context, user_details) {
    const { customer_id, username, password } = user_details;

    const url = "http://localhost:4567/login";
    const params = {
      customer_id,
      user_name: username,
      user_password: password,
    };

    const { status, data } = await call_axios_get_from_vuex(url, context, params);

    if (status === 200) {
      this.commit("settings/set_user_account", user_details);
    }

    return { status, data };
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
