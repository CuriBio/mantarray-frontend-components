<template>
  <div>
    <!-- original mockflow ID: mfPageDa717da1e7012d5f9c379a2ac828b5766 -->
    <div class="div__settingsform-controls">
      <!--  original mockflow ID : cmpD6f871b37d5c9f6c0c0715f4f6ab99523 -->
      <span class="span__settingsform-title">Settings</span>
      <!-- original mockflow ID : cmpD698ee7f9b579fcf64ee501697ea75af9 -->

      <!-- original mockflow ID : cmpDd8b22bfae4d2a9945a94972384dacecd -->
      <span class="span__settingsform-customer-sub-title"
        >Select&nbsp;<wbr />Customer&nbsp;<wbr />ID</span
      >

      <!-- original mockflow ID : cmpD5a52d34b430ce573300ed527a7b6a37d -->

      <div class="div__settingsform-editor-input">
        <InputDropDown
          :title_label="label_customer"
          :placeholder="keyplaceholder_customer"
          :invalid_text="error_text_customer"
          :value.sync="entrykey_customer"
          :input_width="entry_width_customer"
          :disabled="disallow_entry_customer"
          :options_text="nicknames_list_customer"
          :message_if_blank="on_empty_flag_customer"
          :options_id="'cust-'"
        ></InputDropDown>
      </div>
      <div class="div__settingsform-customer-edit-btn" width="88" height="45">
        <span
          v-show="!disable_edit_customer"
          class="span__settingsform-customer-edit-btn-txt"
          ><b-button
            v-b-modal.edit-customer
            squared
            class="w-100 h-100 edit-id"
            style="background-color: #3f3f3f; border: 0px; color: #ececed"
            >Edit&nbsp;<wbr />ID</b-button
          >
          <b-modal
            id="edit-customer"
            size="sm"
            hide-footer
            hide-header
            hide-header-close
          >
            <EditCustomer
              :dialogdata="customer_account_ids[customer_focus_id]"
              :dataindex="customer_focus_id"
              @cancel-id="onCancelCustomerId"
              @save-id="onUpdateCustomerId"
              @delete-id="onDeleteCustomerId"
            ></EditCustomer>
          </b-modal>
        </span>
        <span
          v-show="disable_edit_customer"
          class="span__settingsform-customer-edit-btn-txt-disable"
          >Edit&nbsp;<wbr />ID</span
        >
      </div>
    </div>
    <!-- original MockFlow ID : cmpD428472c72868527900568f8e5efe599b original mockflow ID span cmpD428472c72868527900568f8e5efe599b_txt -->
    <div class="div__settingsform-customer-add-btn" width="285" height="45">
      <span class="span__settingsform-customer-add-btn_txt"
        ><b-button
          v-b-modal.add-customer
          squared
          class="w-100 h-100 edit-id"
          style="background-color: #3f3f3f; border: 0px; color: #ececed"
        >
          Add&nbsp;<wbr />New&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID</b-button
        >
        <b-modal
          id="add-customer"
          size="sm"
          hide-footer
          hide-header
          hide-header-close
        >
          <AddCustomer
            :dataindex="addcustomerid"
            @cancel-id="onCancelAddCustomerId"
            @save-id="onSaveCustomerId"
          ></AddCustomer>
        </b-modal>
      </span>
    </div>
    <canvas class="canvas__settings-title-seperator" width="510" height="20">
    </canvas>
    <canvas class="canvas__settings-customer-seperator" width="510" height="20">
    </canvas>
    <canvas class="canvas__settings-user-seperator" width="510" height="20">
    </canvas>
    <!-- original Mockflow ID : cmpD36f04653a57e9f5f716e9c5a7405b38e -->
    <!--  original Mockflow ID : cmpDa220fe036f45bb8db289301ce0d9f6cc -->
    <span class="span__settingsform-user-account-sub-title"
      >Select&nbsp;<wbr />User&nbsp;<wbr />ID</span
    >

    <!-- original MockFlow ID : cmpD289dc218dd29cfe1f9a4330b16e40c6f -->
    <div class="div__settingsform-user-input">
      <InputDropDown
        :title_label="label_user"
        :placeholder="keyplaceholder_user"
        :invalid_text="error_text_user"
        :value.sync="entrykey_user"
        :input_width="entry_width_user"
        :disabled="disallow_entry_user"
        :options_text="nicknames_list_user"
        :message_if_blank="on_empty_flag_user"
        :options_id="'user-'"
      ></InputDropDown>
    </div>
    <!-- original Mockflow ID : cmpD4c6b34524a3a014988f42e90a7cc071c -->
    <div class="div__settingsform-user-input-edit-btn" width="98" height="45">
      <!-- original Mockflow ID : cmpD4c6b34524a3a014988f42e90a7cc071c_txt -->
      <span
        v-show="!disable_edit_user"
        class="span__settingsform-user-input-edit-btn-txt"
        ><b-button
          v-b-modal.edit-user
          squared
          class="w-100 h-100 edit-id"
          style="background-color: #3f3f3f; border: 0px; color: #ececed"
          >Edit&nbsp;<wbr />ID</b-button
        >
        <b-modal
          id="edit-user"
          size="sm"
          hide-footer
          hide-header
          hide-header-close
        >
          <EditUser
            :dialogdata="transiant_user_ids"
            :dataindex="user_focus_id"
            @cancel-id="onCancelUserId"
            @save-id="onUpdateUserId"
            @delete-id="onDeleteUserId"
          ></EditUser>
        </b-modal>
      </span>
      <span
        v-show="disable_edit_user"
        class="span__settingsform-user-input-edit-btn-txt-disable"
        >Edit&nbsp;<wbr />ID</span
      >
    </div>
    <!-- original MockFlow ID : cmpDbf04a9fad9240b4d1ad4fe7252e91af6 -->
    <div class="div__settingsform-user-input-btn-pos" width="285" height="45">
      <!-- original MockFlow ID : cmpDbf04a9fad9240b4d1ad4fe7252e91af6_txt -->
      <span
        v-show="!disable_add_user"
        class="span__settingsform_user-input-editor"
        ><b-button
          v-b-modal.add-user
          squared
          class="w-100 h-100 edit-id"
          style="background-color: #3f3f3f; border: 0px; color: #ececed"
          >Add&nbsp;<wbr />New&nbsp;<wbr />User&nbsp;<wbr />Account&nbsp;<wbr />ID</b-button
        >
        <b-modal
          id="add-user"
          size="sm"
          hide-footer
          hide-header
          hide-header-close
        >
          <AddUser
            :dataindex="adduserid"
            @cancel-id="onCancelAddUserId"
            @save-id="onSaveUserId"
          ></AddUser>
        </b-modal>
      </span>
      <span
        v-show="disable_add_user"
        class="span__settingsform_user-input-editor-disable"
        >Add&nbsp;<wbr />New&nbsp;<wbr />User&nbsp;<wbr />Account&nbsp;<wbr />ID
      </span>
    </div>
    <!-- original MockFlow ID : cmpDf4cc1d0d47ffb031f42612730c3a717c -->
    <span class="span__settingsform-record-file-settings"
      >Recorded&nbsp;<wbr />File&nbsp;<wbr />Settings</span
    >
    <!-- original MockFlow ID : cmpDf8363fa3bd10c31b09518d79cb6ceed1 -->
    <span class="span__settingsform_auto-upload-settings"
      >Auto&nbsp;<wbr />Upload&nbsp;<wbr />Files&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
    >
    <!-- original MockFlow ID : cmpDc1d6c7119032e462ae6a2f490ceaac70 -->
    <div class="div__settingsform-toggle-icon" width="62" height="34">
      <!-- original MockFlow ID : cmpDc1d6c7119032e462ae6a2f490ceaac70_txt -->
      <span class="span__settingsform-toggle-icon_txt">
        <FontAwesomeIcon :icon="['fa', 'toggle-off']"
      /></span>
    </div>
    <!-- original MockFlow ID : cmpDc445eb537e28e967cb44657eed1baf4f -->
    <span class="span__settingsform-delete-local-files-after-upload_txt"
      >Delete&nbsp;<wbr />Local&nbsp;<wbr />Files&nbsp;<wbr />After&nbsp;<wbr />Uploaded&nbsp;<wbr />to&nbsp;<wbr />Cloud</span
    >
    <!-- original MockFlow ID : cmpD450eb0f3ab55b0dd9f6000a68eada1a1 -->
    <div class="div__settingsform-toggle-icon-2" width="62" height="34">
      <!-- original MockFlow ID : cmpD450eb0f3ab55b0dd9f6000a68eada1a1_cvs -->
      <canvas class="canvas__settingsform-toggle-icon-2" width="62" height="34">
      </canvas>
      <!-- original MockFlow ID : cmpD450eb0f3ab55b0dd9f6000a68eada1a1_txt -->
      <span class="span__settingsform-toggle-icon-2-txt"
        ><FontAwesomeIcon :icon="['fa', 'toggle-off']"
      /></span>
    </div>
    <!-- origonal MockFlow ID : cmpD4873e2fa8d693fa244b11bc36eaee8e1 -->
    <canvas
      class="canvas__settings-file-upload-seperator"
      width="512"
      height="22"
    >
    </canvas>
    <!-- original Mockflow ID : cmpD1df116abcab5b13231c5616233d6cc30 -->
    <span class="span__settings-tool-tip-settings-title"
      >Tool&nbsp;<wbr />Tip&nbsp;<wbr />Settings</span
    >
    <!-- original MockFlow ID : cmpD5e5aa2f092b95fd325e1f97764dc25ca -->
    <span class="span__settings-tool-tip-sub-title"
      >Delay&nbsp;<wbr />Hover&nbsp;<wbr />Description&nbsp;<wbr />Pop-ups</span
    >
    <!-- original MockFlow ID : cmpDe38625daffd1c35fa289a74e6dbbe4ff_txt -->
    <span class="span__settings_tool-tip_input-editor">
      <b-form-input
        v-model="text"
        class="form-control input-sm pull-right"
        placeholder="2"
        style="visibility: visible"
      ></b-form-input>
    </span>
    <!-- original Mockflow ID : cmpD54df1dd00a203636810d5c55417e6e97 -->
    <span class="span__settings_tool-tip_input-editor-unit">seconds</span>
    <!-- original Mockflow ID : cmpD535921733258bc16fd22894de418d29c -->
    <div
      class="span__settings_tool-tip_input-editor-toogle-icon"
      width="62"
      height="34"
    >
      <!-- original Mockflow ID : cmpD535921733258bc16fd22894de418d29c_cvs -->
      <canvas
        class="canvas__settings-tool-tip-input-editor-toogle-icon"
        width="62"
        height="34"
      >
      </canvas>
      <!-- original MockFlow ID : cmpD535921733258bc16fd22894de418d29c_txt -->
      <span class="span__settings-tool-tip-input-editor-toogle-icon-txt"
        ><FontAwesomeIcon :icon="['fa', 'toggle-off']"
      /></span>
    </div>
    <!-- original MockFlow ID : cmpD77a1b6b0cc2201a81a3d9c0485100bc1 -->
    <span class="span__settings-tool-tip_never-show-text"
      >Never&nbsp;<wbr />Show&nbsp;<wbr />Description&nbsp;<wbr />Pop-ups</span
    >
    <!-- original MockFlow ID : cmpDf8b694341fb875af1a45ed417cde193b -->
    <canvas class="canvas__settings-tool-tip-seperator" width="512" height="22">
    </canvas>
    <!-- original MockFlow ID : cmpD98658345877fb84ac42a8c93722c3fe9 -->
    <div class="div__settings-tool-tip-cancel-btn" width="180" height="55">
      <!-- original MockFlow ID : cmpD98658345877fb84ac42a8c93722c3fe9_txt -->
      <span class="span__settings-tool-tip-cancel-btn-txt">Cancel</span>
    </div>
    <!-- original MockFlow ID : cmpDdd160f09d8a297b9e907b79d42e302de -->
    <div class="div__settings-tool-tip-reset-btn" width="180" height="55">
      <!-- original MockFlow ID : cmpDdd160f09d8a297b9e907b79d42e302de_txt -->
      <span
        class="span__settings-tool-tip-reset-btn-txt"
        :class="[
          !valid_user_focus
            ? 'span__settings-tool-tip-reset-btn-txt-disable'
            : 'span__settings-tool-tip-reset-btn-txt-enable',
        ]"
        >Reset&nbsp;<wbr />to&nbsp;<wbr />Defaults</span
      >
    </div>
    <!-- original MockFlow ID : cmpD9ff91bc518ff5a785be6857efab128a0 -->
    <div
      class="div__settings-tool-tip-save-btn"
      :class="[
        !valid_user_focus
          ? 'div__settings-tool-tip-save-btn-disable'
          : 'div__settings-tool-tip-save-btn-enable',
      ]"
      width="180"
      height="55"
    >
      <!-- original Mockflow ID : cmpD9ff91bc518ff5a785be6857efab128a0_cvs -->
      <canvas
        class="canvas__settings-tool-tip-save-btn"
        width="180"
        height="55"
      >
      </canvas>
      <!-- original Mockflow ID : cmpD9ff91bc518ff5a785be6857efab128a0_txt -->
      <span
        class="span__settings-tool-tip-save-btn-txt"
        :class="[
          !valid_user_focus
            ? 'span__settings-tool-tip-save-btn-txt-disable'
            : 'span__settings-tool-tip-save-btn-txt-enable',
        ]"
        @click="savechanges()"
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
import { faToggleOff as fa_toggleoff } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn as fa_toggleon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fa_key);
library.add(fa_toggleoff);
library.add(fa_toggleon);

import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import AddCustomer from "@/components/playback/controls/player/AddCustomer.vue";
import EditCustomer from "@/components/playback/controls/player/EditCustomer.vue";
import AddUser from "@/components/playback/controls/player/AddUser.vue";
import EditUser from "@/components/playback/controls/player/EditUser.vue";
import InputDropDown from "@/components/playback/controls/player/InputDropDown.vue";

Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
Vue.component("BModal", BModal);
Vue.component("BFormInput", BFormInput);

export default {
  name: "SettingsForm",
  components: {
    FontAwesomeIcon,
    AddCustomer,
    EditCustomer,
    AddUser,
    EditUser,
    InputDropDown,
  },
  data() {
    return {
      customerid: "",
      userid: "",
      valid_customer_focus: false,
      valid_user_focus: false,
      customer_focus_id: 0,
      user_focus_id: 0,
      transiant_user_ids: [],
      disable_edit_customer: true,
      disable_add_user: true,
      disable_edit_user: true,

      label_customer: "Customer Account ID",
      entrykey_customer: "",
      keyplaceholder_customer: "Select the Customer",
      error_text_customer: "An ID is required",
      entry_width_customer: 283,
      disallow_entry_customer: false,
      on_empty_flag_customer: true,

      label_user: "User Account ID",
      entrykey_user: "",
      keyplaceholder_user: "Select User",
      error_text_user: "An ID is required",
      entry_width_user: 283,
      disallow_entry_user: false,
      on_empty_flag_user: true,
    };
  },
  computed: {
    ...mapState("settings", {
      customer_account_ids: "customer_account_ids",
    }),
    ...mapState("settings", {
      customer_index: "customer_index",
    }),
    ...mapState("settings", {
      user_index: "user_index",
    }),
    customers_options: function () {
      if (this.customer_account_ids.length == 0) {
        return [];
      } else {
        const list = [];

        for (let i = 0; i < this.customer_account_ids.length; i++) {
          list.push(this.customer_account_ids[i].nickname);
        }
        return list;
      }
    },
    users_options: function () {
      if (this.customerid != "") {
        if (this.customer_account_ids.length != 0) {
          if (
            this.customer_account_ids[this.customer_focus_id].user_ids !==
            undefined
          ) {
            if (
              this.customer_account_ids[this.customer_focus_id].user_ids
                .length == 0
            ) {
              return [];
            } else {
              const userlist = [];
              for (
                let i = 0;
                i <
                this.customer_account_ids[this.customer_focus_id].user_ids
                  .length;
                i++
              ) {
                userlist.push(
                  this.customer_account_ids[this.customer_focus_id].user_ids[i]
                    .nickname
                );
              }
              return userlist;
            }
          }
        }
        return [];
      }
      return [];
    },
    addcustomerid: function () {
      if (this.customer_account_ids.length == 0) {
        return 0;
      } else {
        return this.customer_account_ids.length;
      }
    },
    adduserid: function () {
      if (this.customer_account_ids.length == 0) {
        return 0;
      } else {
        if (
          this.customer_account_ids[this.customer_focus_id].user_ids !=
          undefined
        ) {
          return this.customer_account_ids[this.customer_focus_id].user_ids
            .length;
        } else {
          return 0;
        }
      }
    },
  },
  watch: {
    customerid: function () {
      // const customer_focus = this.customer_account_ids.find(
      //   (customer) => customer.nickname === this.customerid
      // );
      // this.valid_customer_focus = false;
      // this.valid_user_focus = false;
      // if (customer_focus != null) {
      //   this.customer_focus_id = customer_focus.cust_id;
      //   const new_user_ids = customer_focus.user_ids;
      //   this.valid_customer_focus = true;
      //   if (this.user_options !== undefined) {
      //     this.users_options.splice(0, this.users_options.length);
      //     for (let i = 0; i < new_user_ids.length; i++) {
      //       this.users_options.push(new_user_ids[i].nickname);
      //     }
      //   }
      //   this.userid = "";
      // }
      // this.userid = "";
      // if (this.created_flag == true) {
      //   this.created_flag = false;
      //   this.userid = this.customer_account_ids[this.customer_index].user_ids[
      //     this.user_index
      //   ].nickname;
      // }
      // this.modify_btn_states();
    },
    userid: function () {
      // const customer_focus = this.customer_account_ids.find(
      //   (customer) => customer.nickname === this.customerid
      // );
      // if (customer_focus != null) {
      //   const user_focus = customer_focus.user_ids.find(
      //     (user) => user.nickname === this.userid
      //   );
      //   this.valid_user_focus = false;
      //   if (user_focus != null) {
      //     if (this.userid != "") {
      //       this.valid_user_focus = true;
      //       this.user_focus_id = user_focus.user_id;
      //       this.transiant_user_ids = user_focus;
      //     } else {
      //       this.user_focus_id = null;
      //       this.transiant_user_ids = null;
      //     }
      //   } else {
      //     this.user_focus_id = null;
      //     this.transiant_user_ids = null;
      //   }
      //   this.users_options.splice(0, this.users_options.length);
      //   for (let i = 0; i < customer_focus.user_ids.length; i++) {
      //     this.users_options.push(customer_focus.user_ids[i].nickname);
      //   }
      // }
      // this.modify_btn_states();
    },
    entrykey_customer: function () {
      // console.log("===>in entrykey_customer_watch "+this.entrykey_customer);
      if (this.entrykey_customer == "") {
        this.on_empty_flag_customer = true;
      } else {
        const nickname_focus = this.nicknames_list_customer.indexOf(
          this.entrykey_customer
        );
        if (nickname_focus == -1) {
          // logic of "Add New Customer ID" in Settings
          this.on_empty_flag_customer = true; // the reason this would mean the user has to click on "Add New Customer ID as per validation
        } else {
          // logic of enabling making just "Add New Customer ID" and "Edit ID" in Settings
          this.on_empty_flag_customer = false;
          const customer_focus = this.customer_account_ids.find(
            (customer) => customer.nickname === this.entrykey_customer
          );
          // console.log("Value set by the user action are "+customer_focus.cust_id+" and "+ customer_focus.nickname);
          this.valid_customer_focus = false;
          this.valid_user_focus = false;
          if (customer_focus != null) {
            this.customer_focus_id = customer_focus.cust_id;
            const new_user_ids = customer_focus.user_ids;
            // console.log("List of users present with customer_focus is "+new_user_ids[0].user_ids + " and "+new_user_ids[0].nickname );
            // console.log("List of users present with customer_focus is "+new_user_ids[1].user_ids + " and "+new_user_ids[1].nickname );
            this.valid_customer_focus = true;
            if (this.user_options !== undefined) {
              this.users_options.splice(0, this.users_options.length);
              for (let i = 0; i < new_user_ids.length; i++) {
                this.users_options.push(new_user_ids[i].nickname);
                // console.log("We push all users nickname ===> "+new_user_ids[i].nickname);
              }
            }
            this.entrykey_user = "";
            this.nicknames_list_user = this.users_options;
          }
          this.entrykey_user = "";
          if (this.created_flag == true) {
            this.created_flag = false;
            this.entrykey_user = this.customer_account_ids[
              this.customer_index
            ].user_ids[this.user_index].nickname;
          }
          this.modify_btn_states();
        }
      }
      this.modify_btn_states();
    },
    entrykey_user: function () {
      // console.log("===>in entrykey_user_watch"+this.entrykey_user);
      if (this.entrykey_customer == "") {
        this.on_empty_flag_user = true;
      } else {
        const nickname_focus = this.nicknames_list_customer.indexOf(
          this.entrykey_customer
        );
        if (nickname_focus == -1) {
          // logic of "Add New Customer ID" in Settings
          this.on_empty_flag_user = true; // the reason this would mean the user has to click on "Add New Customer ID as per validation
        } else {
          // logic of enabling making just "Add New Customer ID" and "Edit ID" in Settings
          this.on_empty_flag_user = false;
          const customer_focus = this.customer_account_ids.find(
            (customer) => customer.nickname === this.entrykey_customer
          );

          const user_focus = customer_focus.user_ids.find(
            (user) => user.nickname === this.entrykey_user
          );
          this.valid_user_focus = false;
          if (user_focus != null) {
            if (this.entrykey_user != "") {
              this.valid_user_focus = true;
              this.user_focus_id = user_focus.user_id;
              this.transiant_user_ids = user_focus;
            } else {
              this.user_focus_id = null;
              this.transiant_user_ids = null;
            }
          } else {
            this.on_empty_flag_user = true;
            this.user_focus_id = null;
            this.transiant_user_ids = null;
          }

          this.users_options.splice(0, this.users_options.length);
          for (let i = 0; i < customer_focus.user_ids.length; i++) {
            this.users_options.push(customer_focus.user_ids[i].nickname);
          }
          this.nicknames_list_user = this.users_options;
          this.modify_btn_states();
        }
      }
    },
  },
  created: function () {
    this.nicknames_list_customer = this.customers_options;
    this.nicknames_list_user = this.users_options;
    //  console.log(this.nicknames_list_customer);
    //  console.log(this.nicknames_list_user);
    if (this.customer_index != null) {
      this.entrykey_customer = this.customer_account_ids[
        this.customer_index
      ].nickname;
      this.valid_customer_focus = true;
      this.customer_focus_id = this.customer_index;
      this.disable_edit_customer = false;
      this.disable_add_user = false;
      if (this.user_index != null) {
        this.entrykey_user = this.customer_account_ids[
          this.customer_index
        ].user_ids[this.user_index].nickname;
        this.valid_user_focus = true;
        this.user_focus_id = this.user_index;
        this.disable_edit_user = false;
        this.created_flag = true;
        this.on_empty_flag_user = false;
      }
      this.on_empty_flag_customer = false;
    }
  },
  methods: {
    decoder(str) {
      const textArea = document.createElement("textArea");
      textArea.innerHTML = str;
      return textArea.value;
    },
    savechanges() {
      this.$store.commit(
        "settings/set_customer_details",
        this.current_customerids
      );
      this.$store.commit("settings/set_customer_index", this.customer_focus_id);
      this.$store.commit("settings/set_user_index", this.user_focus_id);
    },
    onCancelAddCustomerId() {
      this.$bvModal.hide("add-customer");
    },
    onSaveCustomerId(add_customer) {
      this.$bvModal.hide("add-customer");
      this.entrykey_customer = add_customer.nickname;
      this.customer_account_ids.push(add_customer);
    },
    onCancelCustomerId() {
      this.$bvModal.hide("edit-customer");
    },
    onUpdateCustomerId(edit_customer) {
      this.$bvModal.hide("edit-customer");
      this.entrykey_customer = edit_customer.nickname;
      this.customer_account_ids[edit_customer.cust_id].cust_id =
        edit_customer.cust_id;
      this.customer_account_ids[edit_customer.cust_id].uuid =
        edit_customer.uuid;
      this.customer_account_ids[edit_customer.cust_id].api_key =
        edit_customer.api_key;
      this.customer_account_ids[edit_customer.cust_id].nickname =
        edit_customer.nickname;
      this.customer_account_ids[edit_customer.cust_id].user_ids =
        edit_customer.user_ids;
    },
    onDeleteCustomerId(delete_customer) {
      this.$bvModal.hide("edit-customer");
      /* Received delete_customer remove from the array */
      this.customer_account_ids.splice(delete_customer.cust_id, 1);
      /* Inside the SettingsVue page the index value has to be reset to startup value of 0 */
      this.customer_focus_id = 0;
      /* Now that cust_id element is deleted we need to update all the right side customer cust_id value reduced by 1 */
      if (this.customer_account_ids.length > 1) {
        for (
          let i = delete_customer.cust_id;
          i < this.customer_account_ids.length;
          i++
        ) {
          this.customer_account_ids[i].cust_id =
            this.customer_account_ids[i].cust_id - 1;
        }
      }
      this.entrykey_customer = "";
      this.entrykey_user = "";
    },
    onCancelAddUserId() {
      this.$bvModal.hide("add-user");
    },
    onSaveUserId(add_user) {
      this.$bvModal.hide("add-user");
      this.entrykey_user = add_user.nickname;
      this.customer_account_ids[this.customer_focus_id].user_ids.push(add_user);
      this.users_options.push(add_user.nickname);
    },
    onCancelUserId() {
      this.$bvModal.hide("edit-user");
    },
    onUpdateUserId(edit_user) {
      this.$bvModal.hide("edit-user");
      this.entrykey_user = edit_user.nickname;
      this.customer_account_ids[this.customer_focus_id].user_ids[
        edit_user.user_id
      ].user_id = edit_user.user_id;
      this.customer_account_ids[this.customer_focus_id].user_ids[
        edit_user.user_id
      ].uuid = edit_user.uuid;
      this.customer_account_ids[this.customer_focus_id].user_ids[
        edit_user.user_id
      ].nickname = edit_user.nickname;
    },
    onDeleteUserId(delete_user) {
      this.$bvModal.hide("edit-user");
      // console.log("The Customer Focus ID is"+this.customer_focus_id);
      // console.log("The Customer Nickname now is"+this.customer_account_ids[this.customer_focus_id].nickname);
      this.customer_account_ids[this.customer_focus_id].user_ids.splice(
        delete_user.user_id,
        1
      );
      // console.log(this.customer_account_ids[this.customer_focus_id].user_ids[0].nickname);
      // console.log(this.customer_account_ids[this.customer_focus_id].user_ids[1].nickname);
      /* Now that cust_id element is deleted we need to update all the right side customer cust_id value reduced by 1 */
      for (
        let i = delete_user.user_id;
        i < this.customer_account_ids[this.customer_focus_id].user_ids.length;
        i++
      ) {
        this.customer_account_ids[this.customer_focus_id].user_ids[i].user_id =
          this.customer_account_ids[this.customer_focus_id].user_ids[i]
            .user_id - 1;
      }
      this.transiant_user_ids = null;
      this.user_focus_id = null;
      this.entrykey_user = "";
    },
    modify_btn_states() {
      const num_of_customers = this.customer_account_ids.length;
      let num_of_userids = null;
      if (num_of_customers > 0) {
        num_of_userids = this.customer_account_ids[this.customer_focus_id]
          .user_ids.length;
        if (num_of_userids > 0) {
          const customer_focus = this.customer_account_ids.find(
            (customer) => customer.nickname === this.entrykey_customer
          );
          if (customer_focus != null) {
            const new_user_ids = customer_focus.user_ids;
            this.disable_edit_customer = false;
            this.disable_add_user = false;
            this.disable_edit_user = true;
            if (new_user_ids != undefined) {
              const user_focus = customer_focus.user_ids.find(
                (user) => user.nickname === this.entrykey_user
              );
              if (user_focus != null) {
                this.disable_edit_customer = false;
                this.disable_add_user = false;
                this.disable_edit_user = false;
              } else {
                this.disable_edit_customer = false;
                this.disable_add_user = false;
                this.disable_edit_user = true;
              }
            }
          } else {
            this.disable_edit_customer = true;
            this.disable_add_user = true;
            this.disable_edit_user = true;
          }
        } else {
          this.disable_edit_customer = false;
          this.disable_add_user = false;
          this.disable_edit_user = true;
        }
      } else {
        this.disable_edit_customer = true;
        this.disable_add_user = true;
        this.disable_edit_user = true;
      }
    },
  },
};
</script>
<style type="text/css">
.div__settingsform-controls {
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0);
  width: 700px;
  height: 800px;
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

.span__settingsform-customer-account-id {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 74px;
  left: calc(925px - 734.511px);
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
  z-index: 5;
  background-color: rgba(0, 0, 0);
}

.span__settingsform-customer-sub-title {
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

.form-control {
  display: inline-block;
}

.div__settingsform-editor-input-editor {
  transform: translateZ(0px);
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  width: 285px;
  height: 48px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  padding-left: 0px;
  padding-right: 0px;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  line-height: 45px;
  background-color: #1c1c1c;
  z-index: 55;
}

.div__settingsform-editor-customer-input-editor--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__settingsform-editor-customer-input-editor--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__settingsform-editor-user-input-editor--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__settingsform-editor-user-input-editor--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__settingsform-editor-icon {
  pointer-events: all;
  transform: rotate(315deg);
  position: absolute;
  width: 26px;
  height: 26px;
  top: 122px;
  left: calc(958px - 734.511px);
  visibility: hidden;
  z-index: 56;
}

.span__settingsform-editor-icon-txt {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 16px;
  height: 16px;
  line-height: 16px;
  top: 5px;
  left: 5px;
  font-size: 11px;
  color: rgb(183, 183, 183);
}

.div__settingsform-customer-edit-btn {
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

.span__settingsform-customer-edit-btn-txt {
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

.span__settingsform-customer-edit-btn-txt-disable {
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

.div__settingsform-customer-add-btn {
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

.span__settingsform-customer-add-btn_txt {
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

.canvas__settings-title-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 510px;
  height: 1px;
  top: 56px;
  left: calc(853px - 734.511px);
  visibility: visible;
  z-index: 11;
  background-color: #878d99;
  opacity: 0.5;
}
.canvas__settings-customer-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 510px;
  height: 1px;
  top: 235px;
  left: calc(853px - 734.511px);
  visibility: visible;
  z-index: 29;
  background-color: #878d99;
  opacity: 0.5;
}
.canvas__settings-user-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 510px;
  height: 1px;
  top: 415px;
  left: calc(853px - 734.511px);
  visibility: visible;
  z-index: 39;
  background-color: #878d99;
  opacity: 0.5;
}
.span__settingsform-user-account-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 253px;
  left: calc(925px - 734.511px);
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
  z-index: 55;
}

.span__settingsform-user-account-sub-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 193px;
  height: 30px;
  top: 302.142px;
  left: calc(766.511px - 734.511px);
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
  z-index: 55;
}

.div__settingsform-user-input {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 253px;
  height: 45px;
  top: 245.422px;
  left: calc(962.145px - 734.511px);
  padding: 5px;
  visibility: visible;
  z-index: 7;
}

.div__settingsform-user-input-editor {
  transform: translateZ(0px);
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  width: 285px;
  height: 48px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  padding-left: 0px;
  padding-right: 0px;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(110, 111, 114);
  background-color: #1c1c1c;
  text-align: left;
  line-height: 45px;
  z-index: 55;
}
.div__settingsform-user-input-edit-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 88px;
  height: 45px;
  top: 291.422px;
  left: calc(1258px - 734.511px);
  visibility: visible;
  z-index: 25;
}

.span__settingsform-user-input-edit-btn-txt {
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
  color: rgb(110, 111, 114);
  background-color: #3f3f3f;
}

.span__settingsform-user-input-edit-btn-txt-disable {
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
}

.div__settingsform-user-input-btn-pos {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 285px;
  height: 45px;
  top: 351px;
  left: calc(962px - 734.511px);
  visibility: visible;
  z-index: 9;
}

.span__settingsform_user-input-editor {
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

.span__settingsform_user-input-editor-disable {
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
  color: #6e6f72;
  background-color: #3f3f3f;
}
.span__settingsform-record-file-settings {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 433px;
  left: calc(925px - 734.511px);
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
  top: 471px;
  left: calc(1026px - 734.511px);
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
  top: 475px;
  left: calc(961px - 734.511px);
  visibility: visible;
  z-index: 57;
  color: white;
}
.span__settingsform-toggle-icon_txt {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: bold;
  transform: translateZ(0px);
  position: absolute;
  width: 27px;
  height: 22px;
  line-height: 22px;
  top: 0px;
  left: 23px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 11px;
  background-color: rgb(117, 117, 117);
  z-index: 55;
}
.span__settingsform-delete-local-files-after-upload_txt {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 507px;
  left: calc(1026px - 734.511px);
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
  top: 504px;
  left: calc(961px - 734.511px);
  visibility: visible;
  z-index: 45;
}
.canvas__settingsform-toggle-icon-2 {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 62px;
  height: 34px;
  top: 0px;
  left: 0px;
}
.span__settingsform-toggle-icon-2-txt {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: bold;
  transform: translateZ(0px);
  position: absolute;
  width: 27px;
  height: 22px;
  line-height: 22px;
  top: 6px;
  left: 23px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 11px;
  color: rgb(76, 76, 76);
}
.span__settings-tool-tip-settings-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 431px;
  height: 30px;
  top: 563px;
  left: calc(889.5px - 734.511px);
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
  z-index: 7;
}
.span__settings-tool-tip-sub-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 286px;
  height: 30px;
  top: 611.292px;
  left: calc(810.511px - 734.511px);
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
  z-index: 47;
}
.span__settings_tool-tip_input-editor {
  padding-left: 15px;
  padding-right: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-align: right;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 125px;
  height: 45px;
  line-height: 45px;
  top: 605px;
  left: calc(1090.02px - 734.511px);
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  background-color: #1c1c1c;
  visibility: visible;
  z-index: 55;
}
.span__settings-tool-tip-input-editor-unit {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 286px;
  height: 30px;
  top: 611.292px;
  left: calc(1241.51px - 734.511px);
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
  z-index: 51;
}
.span__settings-tool-tip-input-editor-toogle-icon {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 62px;
  height: 34px;
  top: 656px;
  left: calc(961px - 734.511px);
  visibility: visible;
  z-index: 55;
}
.canvas__settings-tool-tip-input-editor-toogle-icon {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 62px;
  height: 34px;
  top: 0px;
  left: 0px;
}
.span__settings-tool-tip-input-editor-toogle-icon-txt {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: bold;
  transform: translateZ(0px);
  position: absolute;
  width: 27px;
  height: 22px;
  line-height: 22px;
  top: 6px;
  left: 23px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 11px;
  color: rgb(117, 117, 117);
}
.span__settings-tool-tip_never-show-text {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 360px;
  height: 30px;
  top: 659px;
  left: calc(1026px - 734.511px);
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
  z-index: 53;
}
.div__settings-tool-tip-cancel-btn {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 180px;
  height: 55px;
  top: 722px;
  left: calc(823px - 734.511px);
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
  top: 722px;
  left: calc(1018px - 734.511px);
  visibility: visible;
  z-index: 55;
  background-color: rgb(183, 183, 183);
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
  top: 721.556px;
  left: calc(1212.84px - 734.511px);
  visibility: visible;
  z-index: 55;
}
.div__settings-tool-tip-save-btn-enable {
  background-color: rgb(183, 183, 183);
}
.div__settings-tool-tip-save-btn-disable {
  background-color: rgb(183, 183, 183);
}
.div__settings-tool-tip-save-btn-enable:hover {
  background-color: #19ac8a;
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

.span__settings-tool-tip-save-btn-txt-disable {
  color: #6e6f72;
}

.span__settings-tool-tip-save-btn-txt-enable {
  color: rgb(0, 0, 0);
}

.span__settings-tool-tip-reset-btn-txt-disable {
  color: #6e6f72;
}

.span__settings-tool-tip-reset-btn-txt-enable {
  color: rgb(0, 0, 0);
}

.canvas__settings-file-upload-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 512px;
  height: 1px;
  top: 543px;
  left: calc(852px - 734.511px);
  visibility: visible;
  background-color: #878d99;
  opacity: 0.5;
  z-index: 33;
}

.canvas__settings-tool-tip-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 512px;
  height: 1px;
  top: 694px;
  left: calc(852px - 734.511px);
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
