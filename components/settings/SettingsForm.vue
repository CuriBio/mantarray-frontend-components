<template>
  <div>
    <div class="div__settingsform-controls">
      <span class="span__settingsform-title">Settings</span>
      <span class="span__settingsform-user-sub-title">Select&nbsp;<wbr />User</span>

      <div class="div__settingsform-editor-input">
        <InputDropDown
          :title_label="label_user"
          :placeholder="key_placeholder_user"
          :invalid_text="error_text_user"
          :value.sync="entrykey_user"
          :input_width="entry_width_user"
          :disabled="disallow_entry_user"
          :options_text="get_user_names"
          :message_if_invalid="!user_found"
          :options_id="'user-account-'"
        />
      </div>
      <div class="div__settingsform-user-edit-btn" width="88" height="45">
        <span v-show="!disable_edit_user" class="span__settingsform-user-edit-btn-txt">
          <b-button
            id="edit-a-user"
            v-b-modal.edit-user
            squared
            class="w-100 h-100 edit-id"
            style="background-color: #3f3f3f; border: 0px; color: #ececed"
            >Edit&nbsp;<wbr />User
          </b-button>
          <b-modal id="edit-user" size="sm" hide-footer hide-header hide-header-close>
            <EditUser
              :dialogdata="user_accounts[user_focus_idx]"
              :open_for_invalid_creds="open_for_invalid_creds"
              @cancel-id="cancel_user_update"
              @save-id="apply_user_update"
              @delete-id="delete_user"
            />
          </b-modal>
        </span>
        <span v-show="disable_edit_user" class="span__settingsform-user-edit-btn-txt-disable"
          >Edit&nbsp;<wbr />User</span
        >
      </div>
    </div>
    <div class="div__settingsform-user-add-btn" width="285" height="45">
      <span class="span__settingsform-user-add-btn_txt">
        <b-button
          id="add-a-user"
          v-b-modal.add-user
          squared
          class="w-100 h-100 edit-id"
          style="background-color: #3f3f3f; border: 0px; color: #ececed"
        >
          Add&nbsp;<wbr />New&nbsp;<wbr />User</b-button
        >
        <b-modal id="add-user" size="sm" hide-footer hide-header hide-header-close>
          <AddUser @cancel-id="cancel_adding_user" @save-id="save_new_user" />
        </b-modal>
      </span>
    </div>
    <canvas class="canvas__settings-title-separator" width="510" height="20"> </canvas>
    <span class="span__settingsform-record-file-settings">
      Recorded&nbsp;<wbr />File&nbsp;<wbr />Settings</span
    >
    <span class="span__settingsform_auto-upload-settings"
      >Auto&nbsp;<wbr />Upload&nbsp;<wbr />Files&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
    >
    <div class="div__settingsform-toggle-icon" width="62" height="34">
      <ToggleWidget
        id="auto_upload_switch"
        :checked_state="auto_upload"
        :label="'auto_upload'"
        :disabled="disable_toggle"
        @handle_toggle_state="handle_toggle_state"
      />
    </div>
    <div v-show="!auto_upload" class="div__pulse3d-input-blocker"></div>
    <span class="span__settingsform_pulse3d-version-settings">Pulse3D&nbsp;<wbr />Version</span>
    <div class="div__settingsform-dropdown">
      <SmallDropDown
        :input_height="25"
        :input_width="80"
        :disable_selection="false"
        :options_text="sorted_pulse3d_versions"
        :options_idx="pulse3d_focus_idx"
        :dom_id_suffix="'pulse3d_version'"
        @selection-changed="handle_pulse3d_selection_change"
      />
    </div>
    <span class="span__settingsform-delete-local-files-after-upload_txt"
      >Delete&nbsp;<wbr />Local&nbsp;<wbr />Files&nbsp;<wbr />After&nbsp;<wbr />Uploaded&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
    >
    <div class="div__settingsform-toggle-icon-2" width="62" height="34">
      <ToggleWidget
        id="auto_delete_switch"
        :checked_state="auto_delete"
        :label="'auto_delete'"
        :disabled="!disable_toggle"
        @handle_toggle_state="handle_toggle_state"
      />
    </div>

    <span v-if="beta_2_mode" class="span__settingsform-show-recording-snapshot-text"
      >Show&nbsp;<wbr />Snapshot&nbsp;<wbr />After&nbsp;<wbr />Recording</span
    >
    <div v-if="beta_2_mode" class="div__settingsform-toggle-icon-3" width="62" height="34">
      <ToggleWidget
        id="recording_snapshot_switch"
        :checked_state="recording_snapshot_state"
        :label="'recording_snapshot_state'"
        @handle_toggle_state="handle_toggle_state"
      />
    </div>

    <canvas class="canvas__settings-file-upload-separator" width="512" height="22"> </canvas>
    <div class="div__settings-tool-tip-cancel-btn" width="180" height="55" @click="cancel_changes">
      <span class="span__settings-tool-tip-cancel-btn-txt">Cancel</span>
    </div>
    <div
      class="div__settings-tool-tip-reset-btn"
      :class="[
        user_found ? 'div__settings-tool-tip-reset-btn-enable' : 'div__settings-tool-tip-reset-btn-disable',
      ]"
      width="180"
      height="55"
    >
      <span
        class="span__settings-tool-tip-reset-btn-txt"
        :class="[
          user_found
            ? 'span__settings-tool-tip-reset-btn-txt-enable'
            : 'span__settings-tool-tip-reset-btn-txt-disable',
        ]"
        @click="reset_changes()"
        >Reset&nbsp;<wbr />to&nbsp;<wbr />Defaults</span
      >
    </div>
    <div
      class="div__settings-tool-tip-save-btn"
      :class="[
        user_found ? 'div__settings-tool-tip-save-btn-enable' : 'div__settings-tool-tip-save-btn-disable',
      ]"
      width="180"
      height="55"
    >
      <canvas class="canvas__settings-tool-tip-save-btn" width="180" height="55"> </canvas>
      <span
        class="span__settings-tool-tip-save-btn-txt"
        :class="[
          user_found
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

import { faKey as fa_key } from "@fortawesome/free-solid-svg-icons";

library.add(fa_key);

import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import AddUser from "@/components/settings/AddUser.vue";
import EditUser from "@/components/settings/EditUser.vue";
import InputDropDown from "@/components/basic_widgets/InputDropDown.vue";
import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";

import semver_sort from "semver-sort";

Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
Vue.component("BModal", BModal);
Vue.component("BFormInput", BFormInput);

export default {
  name: "SettingsForm",
  components: {
    AddUser,
    EditUser,
    InputDropDown,
    ToggleWidget,
    SmallDropDown,
  },
  data() {
    return {
      user_focus_idx: 0,
      disable_edit_user: true,
      label_user: "User Selection",
      entrykey_user: "",
      key_placeholder_user: "Select User",
      error_text_user: "An ID is required",
      entry_width_user: 283,
      disallow_entry_user: false,
      user_found: false,
      open_for_invalid_creds: false,
      auto_upload: false,
      pulse3d_focus_idx: 0,
      auto_delete: false,
      disable_toggle: false,
      recording_snapshot_state: true,
    };
  },
  computed: {
    ...mapState("settings", [
      "beta_2_mode",
      "user_accounts",
      "active_user_index",
      "stored_customer_id",
      "pulse3d_versions",
      "pulse3d_version_selection_index",
    ]),
    get_user_names: function () {
      return this.user_accounts.map((user_account) => user_account.user_name);
    },
    sorted_pulse3d_versions: function () {
      return semver_sort.desc(this.pulse3d_versions);
    },
  },
  watch: {
    entrykey_user: function () {
      const user_focus_idx = this.get_user_names.indexOf(this.entrykey_user);
      this.user_found = this.entrykey_user !== "" && user_focus_idx !== -1;
      if (this.user_found) {
        this.user_focus_idx = user_focus_idx;
      }
      this.modify_btn_states();
    },
  },
  created: function () {
    if (this.active_user_index != null) {
      this.entrykey_user = this.user_accounts[this.active_user_index].user_name;
      this.user_focus_idx = this.active_user_index;
      this.disable_edit_user = false;
      this.user_found = true;
    }
    this.pulse3d_focus_idx = this.pulse3d_version_selection_index;
  },
  methods: {
    async save_changes() {
      if (this.user_found) {
        this.$store.commit("settings/set_active_user_index", this.user_focus_idx);
        this.$store.commit("settings/set_auto_upload", this.auto_upload);
        this.$store.commit("settings/set_auto_delete", this.auto_delete);
        this.$store.commit("settings/set_recording_snapshot_state", this.recording_snapshot_state);
        this.$store.commit("settings/set_pulse3d_version_selection_index", this.pulse3d_focus_idx);

        const { status } = await this.$store.dispatch("settings/update_settings");

        // Currently, error-handling by resetting inputs to force user to try again if axios request fails
        if (status === 200) {
          this.$emit("close_modal", true);
        } else if (status == 401) {
          this.open_for_invalid_creds = true;
          this.$bvModal.show("edit-user");
        } else {
          this.reset_changes();
        }
      }
    },
    reset_changes() {
      this.entrykey_user = "";
      this.auto_delete = false;
      this.auto_upload = false;
      this.recording_snapshot_state = true;

      this.$store.commit("settings/reset_to_default");
    },
    cancel_changes() {
      this.$emit("close_modal", false);
    },
    cancel_adding_user() {
      this.$bvModal.hide("add-user");
    },
    save_new_user(new_user) {
      this.$bvModal.hide("add-user");
      this.user_accounts.push(new_user);
      this.entrykey_user = new_user.user_name;
    },
    cancel_user_update() {
      this.$bvModal.hide("edit-user");
    },
    apply_user_update(edited_user) {
      this.$bvModal.hide("edit-user");
      this.open_for_invalid_creds = false;
      // need to use splice so that Vue will recognize that the array was updated
      this.user_accounts.splice(this.user_focus_idx, 1, edited_user);
      this.entrykey_user = edited_user.user_name;
    },
    delete_user() {
      this.$bvModal.hide("edit-user");
      this.open_for_invalid_creds = false;
      // need to use splice so that Vue will recognize that the array was updated
      this.user_accounts.splice(this.user_focus_idx, 1);
      this.user_focus_idx = 0;
      this.entrykey_user = "";
    },
    modify_btn_states() {
      this.disable_edit_user = !this.user_found;
    },
    handle_toggle_state: function (state, label) {
      this[label] = state;
    },
    handle_pulse3d_selection_change: function (idx) {
      this.pulse3d_focus_idx = idx;
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
  height: 545px;
  position: absolute;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.span__settingsform-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 700px;
  height: 34px;
  top: 13px;
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

.span__settingsform-user-sub-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 225px;
  height: 30px;
  top: 123.142px;
  left: calc(734.511px - 734.511px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
  z-index: 21;
}

.div__settingsform-editor-input {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 285px;
  height: 45px;
  top: 70.422px;
  left: calc(962.145px - 734.511px);
  padding: 0px;
  visibility: visible;
  z-index: 55;
}

.div__settingsform-user-edit-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 88px;
  height: 45px;
  top: 112.422px;
  left: calc(1258px - 734.511px);
  visibility: visible;
  z-index: 25;
}

.span__settingsform-user-edit-btn-txt {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 88px;
  height: 45px;
  line-height: 47px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(236, 236, 237);
  background-color: #3f3f3f;
  z-index: 55;
}

.span__settingsform-user-edit-btn-txt-disable {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 88px;
  height: 45px;
  line-height: 47px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: #6e6f72;
  background-color: #3f3f3f;
  z-index: 55;
}

.div__settingsform-user-add-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 285px;
  height: 45px;
  top: 172px;
  left: calc(962.145px - 734.511px);
  visibility: visible;
  z-index: 25;
}

.span__settingsform-user-add-btn_txt {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 285px;
  height: 45px;
  line-height: 47px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(236, 236, 237);
  background-color: #3f3f3f;
}

.canvas__settings-title-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 510px;
  height: 1px;
  top: 56px;
  left: 95px;
  visibility: visible;
  z-index: 11;
  background-color: #878d99;
  opacity: 0.5;
}

.span__settingsform-record-file-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 253px;
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
  top: 291px;
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
  top: 293px;
  left: calc(961px - 775.511px);
  visibility: visible;
  z-index: 57;
  color: white;
}

.div__pulse3d-input-blocker {
  position: absolute;
  width: 285px;
  height: 30px;
  top: 327px;
  left: calc(1026px - 775.511px);
  visibility: visible;
  opacity: 0.5;
  background-color: black;
  z-index: 100;
}

.span__settingsform_pulse3d-version-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 285px;
  height: 30px;
  top: 327px;
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
  top: 327px;
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
  top: 363px;
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
  top: 399px;
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
  top: 364px;
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
  top: 399px;
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
  top: 475px;
  left: 450px;
  visibility: visible;
  z-index: 55;
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
.div__settings-tool-tip-reset-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 180px;
  height: 55px;
  top: 475px;
  left: 260px;
  visibility: visible;
  z-index: 55;
  background-color: #b7b7b7c9;
}
.span__settings-tool-tip-reset-btn-txt {
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
.div__settings-tool-tip-save-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 180px;
  height: 55px;
  top: 475px;
  left: 70px;
  visibility: visible;
  z-index: 55;
}
.div__settings-tool-tip-save-btn-enable,
.div__settings-tool-tip-reset-btn-enable {
  background-color: rgb(183, 183, 183);
}

.div__settings-tool-tip-save-btn-disable,
.div__settings-tool-tip-reset-btn-disable {
  background-color: #b7b7b7c9;
}

.div__settings-tool-tip-save-btn-enable:hover {
  background-color: #19ac8a;
  cursor: pointer;
}

.div__settings-tool-tip-reset-btn-enable:hover,
.div__settings-tool-tip-cancel-btn:hover {
  background-color: #b7b7b7c9;
  cursor: pointer;
}

.canvas__settings-tool-tip-save-btn {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 180px;
  height: 55px;
  top: 0px;
  left: 0px;
}
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

.span__settings-tool-tip-save-btn-txt-disable,
.span__settings-tool-tip-reset-btn-txt-disable {
  color: #6e6f72;
}

.span__settings-tool-tip-reset-btn-txt-enable,
.span__settings-tool-tip-save-btn-txt-enable {
  color: rgb(0, 0, 0);
}

.canvas__settings-file-upload-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 512px;
  height: 1px;
  top: 454px;
  left: 95px;
  visibility: visible;
  background-color: #878d99;
  opacity: 0.5;
  z-index: 33;
}

.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

.modal {
  position: fixed;
  top: 15%;
  left: -25%;
}

.btn {
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
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
#add-user,
#edit-user,
#add-user,
#edit-user {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
