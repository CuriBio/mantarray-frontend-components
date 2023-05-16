<template>
  <div>
    <div class="div__settingsform-controls">
      <span class="span__settingsform-title">User Settings</span>
      <canvas class="canvas__settings-title-separator" />
      <div class="div__settingsform-editor-input">
        <InputWidget
          :title_label="'Select Customer ID'"
          :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
          :invalid_text="error_text.customer_id"
          :input_width="400"
          :initial_value="user_details.customer_id"
          :dom_id_suffix="'customer-id'"
          :container_background_color="'rgba(0, 0, 0)'"
          :input_background_color="'#1c1c1c'"
          @update:value="on_update_input($event, 'customer_id')"
        />
      </div>
      <div class="div__settingsform-editor-input">
        <InputDropDown
          :title_label="'Select User'"
          :placeholder="'user account 1'"
          :invalid_text="error_text.username"
          :input_width="400"
          :value="user_details.username"
          :options_text="stored_usernames"
          :options_id="'user-account-'"
          @update:value="on_update_input($event, 'username')"
        />
      </div>
      <div class="div__settingsform-editor-input">
        <InputWidget
          :title_label="'Enter Password'"
          :placeholder="'****'"
          :invalid_text="error_text.password"
          :type="'password'"
          :spellcheck="false"
          :initial_value="user_details.password"
          :container_background_color="'rgba(0, 0, 0)'"
          :input_background_color="'#1c1c1c'"
          :input_width="400"
          :dom_id_suffix="'passkey-id'"
          @update:value="on_update_input($event, 'password')"
        />
      </div>
      <div
        class="div__settings-login-btn"
        :class="[
          is_login_enabled
            ? 'div__settings-tool-tip-login-btn-enable'
            : 'div__settings-tool-tip-login-btn-disable',
        ]"
      >
        <span
          class="span__settings-tool-tip-login-btn-txt"
          :class="[
            is_login_enabled
              ? 'span__settings-tool-tip-login-btn-txt-enable'
              : 'span__settings-tool-tip-login-btn-txt-disable',
          ]"
          @click="login_user"
          >Login</span
        >
      </div>
    </div>
    <div v-if="is_user_logged_in" class="div__logged_in_text">
      <FontAwesomeIcon :icon="['fa', 'check']" style="margin-right: 7px" />Success
    </div>
    <span class="span__settingsform-record-file-settings">
      Recorded&nbsp;<wbr />File&nbsp;<wbr />Settings</span
    >
    <span class="span__settingsform_auto-upload-settings"
      >Auto&nbsp;<wbr />Upload&nbsp;<wbr />Files&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
    >
    <div class="div__settingsform-toggle-icon">
      <ToggleWidget
        id="auto_upload_switch"
        :checked_state="user_settings.auto_upload"
        :label="'auto_upload'"
        :disabled="!is_user_logged_in || job_limit_reached"
        @handle_toggle_state="handle_toggle_state"
      />
      <div
        v-if="!is_user_logged_in"
        v-b-popover.hover.left="'Must be logged in'"
        class="div__tooltip-container"
      />
    </div>
    <div
      v-show="!user_settings.auto_upload || !is_user_logged_in"
      v-b-popover.hover.top="!is_user_logged_in ? 'Must be logged in' : 'Auto-upload must be enabled'"
      class="div__pulse3d-input-blocker"
    />
    <span class="span__settingsform_pulse3d-version-settings">Pulse3D&nbsp;<wbr />Version</span>
    <div class="div__settingsform-dropdown">
      <SmallDropDown
        :input_height="25"
        :input_width="80"
        :disable_selection="!is_user_logged_in"
        :options_text="sorted_pulse3d_versions"
        :options_idx="user_settings.pulse3d_focus_idx"
        :dom_id_suffix="'pulse3d_version'"
        @selection-changed="handle_pulse3d_selection_change"
      />
    </div>
    <div v-if="show_auto_delete">
      <span class="span__settingsform-delete-local-files-after-upload_txt"
        >Delete&nbsp;<wbr />Local&nbsp;<wbr />Files&nbsp;<wbr />After&nbsp;<wbr />Uploaded&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
      >
      <div class="div__settingsform-toggle-icon-2">
        <ToggleWidget
          id="auto_delete_switch"
          :checked_state="user_settings.auto_delete"
          :label="'auto_delete'"
          :disabled="disable_settings"
          @handle_toggle_state="handle_toggle_state"
        />
      </div>
    </div>
    <span v-if="beta_2_mode" class="span__settingsform-show-recording-snapshot-text"
      >Show&nbsp;<wbr />Snapshot&nbsp;<wbr />After&nbsp;<wbr />Recording</span
    >
    <div v-if="beta_2_mode" class="div__settingsform-toggle-icon-3">
      <ToggleWidget
        id="recording_snapshot_switch"
        :checked_state="user_settings.recording_snapshot"
        :label="'recording_snapshot'"
        :disabled="!is_user_logged_in"
        @handle_toggle_state="handle_toggle_state"
      />
      <div
        v-if="!is_user_logged_in"
        v-b-popover.hover.left="'Must be logged in'"
        class="div__tooltip-container"
      />
    </div>

    <canvas class="canvas__settings-file-upload-separator" />
    <div class="div__settings-tool-tip-cancel-btn" @click="cancel_changes">
      <span class="span__settings-tool-tip-cancel-btn-txt">Close</span>
    </div>
    <div
      class="div__settings-tool-tip-save-btn"
      :class="[
        is_user_logged_in
          ? 'div__settings-tool-tip-save-btn-enable'
          : 'div__settings-tool-tip-save-btn-disable',
      ]"
    >
      <canvas class="canvas__settings-tool-tip-save-btn" />
      <span
        class="span__settings-tool-tip-save-btn-txt"
        :class="[
          is_user_logged_in
            ? 'span__settings-tool-tip-save-btn-txt-enable'
            : 'span__settings-tool-tip-save-btn-txt-disable',
        ]"
        @click="save_changes()"
        >Save&nbsp;<wbr />Changes</span
      >
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck as fa_check } from "@fortawesome/free-solid-svg-icons";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import InputDropDown from "@/components/basic_widgets/InputDropDown.vue";
import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import { VBPopover } from "bootstrap-vue";
import semver_sort from "semver-sort";

Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
Vue.component("BModal", BModal);
Vue.component("BFormInput", BFormInput);
Vue.directive("b-popover", VBPopover);
library.add(fa_check);

export default {
  name: "SettingsForm",
  components: {
    InputDropDown,
    ToggleWidget,
    SmallDropDown,
    InputWidget,
    FontAwesomeIcon,
  },
  data() {
    return {
      disable_settings: true,
      invalid_creds_found: false,
      show_auto_delete: false,
      user_settings: {
        auto_upload: false,
        pulse3d_focus_idx: 0,
        auto_delete: false,
        recording_snapshot: true,
      },
      user_details: {
        customer_id: "",
        password: "",
        username: "",
      },
    };
  },
  computed: {
    ...mapState("settings", [
      "beta_2_mode",
      "user_account",
      "stored_customer_id",
      "pulse3d_versions",
      "pulse3d_version_selection_index",
      "job_limit_reached",
      "stored_usernames",
      "auto_upload",
      "auto_delete",
      "run_recording_snapshot_default",
    ]),
    sorted_pulse3d_versions: function () {
      return semver_sort.desc(this.pulse3d_versions);
    },
    is_login_enabled: function () {
      return !Object.values(this.error_text).some((val) => val !== "");
    },
    error_text: function () {
      return this.invalid_creds_found
        ? {
            customer_id: "Invalid Customer ID, Username, or Password",
            username: "Invalid Customer ID, Username, or Password",
            password: "Invalid Customer ID, Username, or Password",
          }
        : {
            customer_id:
              this.user_details.customer_id && this.user_details.customer_id !== "" ? "" : "Required",
            username: this.user_details.username && this.user_details.username !== "" ? "" : "Required",
            password: this.user_details.password && this.user_details.password !== "" ? "" : "Required",
          };
    },
    is_user_logged_in: function () {
      return this.user_account.username && this.user_account.username !== "";
    },
  },
  watch: {
    job_limit_reached: function () {
      if (this.job_limit_reached) {
        this.user_settings.auto_upload = false;
      }
    },
    stored_customer_id: function () {
      this.user_details.customer_id = this.stored_customer_id;
    },
  },
  methods: {
    async save_changes() {
      this.$store.dispatch("settings/update_settings", this.user_settings);
      // storing separate and is always able to be saved
      this.$store.commit("settings/set_recording_snapshot_state", this.user_settings.recording_snapshot);
      // close modal always on save changes
      this.$emit("close_modal", true);
    },
    async login_user() {
      const { status, data } = await this.$store.dispatch("settings/login_user", this.user_details);
      // Currently, error-handling by resetting inputs to force user to try again if axios request fails
      if (status === 200) {
        this.$store.commit("settings/set_job_limit_reached", data.usage_quota.jobs_reached);
      } else if (status === 401) {
        this.invalid_creds_found = true;
      }

      // this protects if a user toggles the rec settings, but clicks login instead of save
      this.reset_to_stored_state();
    },
    on_update_input: function (new_value, field) {
      this.invalid_creds_found = false;
      this.user_details = { ...this.user_details, [field]: new_value };
    },
    cancel_changes() {
      this.reset_to_stored_state();
      this.user_details = { ...this.user_account };
      // if user is logged in and just wants to close the modal, then set to true and still save to YAML
      this.$emit("close_modal", this.is_user_logged_in);
    },
    reset_to_stored_state() {
      // reset to existing stored state, that can still be different than initial default state, so don't call reset_to_default
      this.user_settings.auto_delete = this.auto_delete;
      this.user_settings.auto_upload = this.auto_upload;
      this.user_settings.recording_snapshot = this.run_recording_snapshot_default;
      this.user_settings.pulse3d_focus_idx = this.pulse3d_version_selection_index;
    },
    handle_toggle_state: function (state, label) {
      this.user_settings[label] = state;
    },
    handle_pulse3d_selection_change: function (idx) {
      this.user_settings.pulse3d_focus_idx = idx;
    },
  },
};
</script>
<style scoped>
.div__settingsform-controls {
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0);
  width: 700px;
  height: 723px;
  position: absolute;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.span__settingsform-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: relative;
  width: 700px;
  height: 34px;
  margin-top: 13px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 23px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 3;
  background-color: rgba(0, 0, 0);
}

.div__settingsform-editor-input {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: relative;
  width: 400px;
  height: 100px;
  padding: 0px;
  visibility: visible;
  z-index: 55;
}

.canvas__settings-title-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: relative;
  width: 510px;
  height: 1px;
  visibility: visible;
  z-index: 11;
  background-color: #878d99;
  opacity: 0.5;
  margin: 10px 0;
}

.div__logged_in_text {
  color: rgb(25, 172, 138);
  position: absolute;
  font-size: 16px;
  width: 105px;
  z-index: 2;
  left: 458px;
  top: 395px;
  font-style: italic;
}

.span__settingsform-record-file-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 453px;
  left: calc(925px - 750.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 37;
}
.span__settingsform_auto-upload-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 232px;
  height: 30px;
  top: 491px;
  left: calc(1026px - 775.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 41;
}
.div__settingsform-toggle-icon {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 62px;
  height: 34px;
  top: 491px;
  left: calc(961px - 775.511px);
  visibility: visible;
  z-index: 45;
}

.div__pulse3d-input-blocker {
  position: absolute;
  width: 285px;
  height: 30px;
  top: 527px;
  left: calc(1026px - 775.511px);
  visibility: visible;
  opacity: 0.5;
  background-color: black;
  z-index: 100;
}
.div__tooltip-container {
  height: 30px;
  top: -40px;
  position: relative;
  width: 50px;
}
.span__settingsform_pulse3d-version-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 285px;
  height: 30px;
  top: 527px;
  left: calc(1026px - 775.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 41;
}
.div__settingsform-dropdown {
  pointer-events: all;
  transform: rotate(0deg);
  /* overflow: hidden; */
  position: absolute;
  width: 80px;
  height: 34px;
  top: 527px;
  left: calc(961px - 566px);
  visibility: visible;
  z-index: 57;
  color: white;
}

.span__settingsform-delete-local-files-after-upload_txt {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 563px;
  left: calc(1026px - 775.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 43;
}
.span__settingsform-show-recording-snapshot-text {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 360px;
  height: 30px;
  top: 564px;
  left: calc(1026px - 775.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 43;
}
.div__settingsform-toggle-icon-2 {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 62px;
  height: 34px;
  top: 564px;
  left: calc(961px - 775.511px);
  visibility: visible;
  z-index: 45;
}

.div__settingsform-toggle-icon-3 {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 62px;
  height: 34px;
  top: 564px;
  left: calc(961px - 775.511px);
  visibility: visible;
  z-index: 45;
}

.div__settings-tool-tip-cancel-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 180px;
  height: 55px;
  top: 639px;
  left: 362px;
  visibility: visible;
  z-index: 55;
  background-color: rgb(183, 183, 183);
}

.div__settings-login-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: relative;
  width: 180px;
  height: 55px;
  margin: 12px 0;
  background-color: rgb(183, 183, 183);
}
.span__settings-tool-tip-cancel-btn-txt {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 170px;
  height: 45px;
  line-height: 47px;
  top: 5px;
  left: 5px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(0, 0, 0);
  z-index: 55;
}
.div__settings-tool-tip-save-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 180px;
  height: 55px;
  top: 639px;
  left: 160px;
  visibility: visible;
  z-index: 55;
}
.div__settings-tool-tip-save-btn-enable,
.div__settings-tool-tip-login-btn-enable {
  background-color: rgb(183, 183, 183);
  cursor: pointer;
}

.div__settings-tool-tip-save-btn-disable,
.div__settings-tool-tip-login-btn-disable {
  background-color: #b7b7b7c9;
}

.div__settings-tool-tip-save-btn-enable:hover {
  background-color: #19ac8a;
}

.div__settings-tool-tip-login-btn-enable:hover,
.div__settings-tool-tip-cancel-btn:hover {
  background-color: #b7b7b7c9;
  cursor: pointer;
}

.span__settings-tool-tip-btn-txt-disable {
  color: #6e6f72;
}

.span__settings-tool-tip-save-btn-txt-disable,
.span__settings-tool-tip-login-btn-txt-disable {
  color: #6e6f72;
}

.span__settings-tool-tip-btn-txt-enable,
.span__settings-tool-tip-btn-txt-enable {
  color: rgb(0, 0, 0);
}
.canvas__settings-tool-tip-save-btn {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 180px;
  height: 55px;
  top: 0px;
  left: 0px;
}
.span__settings-tool-tip-login-btn-txt,
.span__settings-tool-tip-save-btn-txt {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 170px;
  height: 45px;
  line-height: 47px;
  top: 5px;
  left: 5px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
}

.canvas__settings-file-upload-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 512px;
  height: 1px;
  top: 612px;
  left: 95px;
  visibility: visible;
  background-color: #878d99;
  opacity: 0.5;
  z-index: 33;
}

.form-control {
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 12px;
  display: inline-block;
}

.form-control:focus {
  border: none;
  box-shadow: none;
  -webkit-box-shadow: none;
}

datalist {
  display: none;
  background: #2f2f2f;
  font: 17px Muli;
  color: #ececed;
}
</style>
