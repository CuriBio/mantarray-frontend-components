<template>
  <div>
    <!--  original mockflow ID: cmpDc54e609e01ab45fb2f51a84618a6bc29  -->
    <div
      class="div__popdialog-form-controls"
      :class="div__popdialog_form_controls_dynamic"
    ></div>
    <!-- eslint-disable vue/no-v-html -->
    <span
      class="span__popdialog-form-controls-content-title"
      v-html="HTML_contenttitle"
    >
      <!--  original mockflow ID: cmpDf2b95d910a8537f9852c471fb3731e39  -->
    </span>
    <span
      class="span__popdialog-form-controls-content-numericid-label"
      v-html="HTML_numericid"
    >
      <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
    </span>

    <div
      class="div__popdialog-form-controls-content-numericid-input"
      :class="[
        !alphanumerickeyState
          ? 'div__popdialog-form-controls-content-numericid-input--invalid'
          : 'div__popdialog-form-controls-content-numericid-input--valid',
      ]"
      width="382"
      height="57"
    >
      <!--  original mockflow ID: cmpD2ffd520cd8c8ffd69afd18eff66d9431    -->
      <span class="span__popdialog-form-controls-content-numericid-input-txt">
        <b-form-input
          id="input-alphanumeric"
          v-model="alphanumerickey"
          spellcheck="false"
          :state="alphanumerickeyState"
          aria-describedby="input-alphanumeric-feedback"
          :placeholder="alphanumerickeyplaceholder"
          class="w-100 h-100 edit-id"
          style="
            border-radius: 0;
            color: rgb(255, 255, 255);
            background-color: #3f3f3f;
            border: 0px;
          "
        ></b-form-input>
      </span>
      <!-- original mockflow ID: cmpD2ffd520cd8c8ffd69afd18eff66d9431_txt    -->
    </div>
    <div
      v-show="!alphanumerickeyState"
      class="div__popdialog-form-controls-content-numericid-input-invalid-info"
    >
      {{ alphanumeric_invalid_txt }}
    </div>
    <!-- original mockflow ID: cmpD05c79c4aa632eb8e05143fcfa1959bbe  -->
    <span
      class="span__popdialog-form-controls-content-apikey-label"
      v-html="HTML_apikey"
    >
    </span>
    <!-- original mockflow ID: cmpD4f79d9718567a0c84b4076e7af0a759a  -->
    <div
      class="div__popdialog-form-controls-content-apikey-input"
      :class="[
        !apikeyState
          ? 'div__popdialog-form-controls-content-apikey-input--invalid'
          : 'div__popdialog-form-controls-content-apikey-input--valid',
      ]"
      width="382"
      height="57"
    >
      <span
        class="span__popdialog-form-controls-content-apikey-input-txt"
        :class="[
          is_customer
            ? 'span__popdialog-form-controls-content-apikey-input-txt-customer-enable'
            : 'span__popdialog-form-controls-content-apikey-input-txt-user-enable',
        ]"
      >
        <b-form-input
          id="input-apikey"
          v-model="apikey"
          spellcheck="false"
          :state="apikeyState"
          aria-describedby="input-apikey-feedback"
          :placeholder="apikeyplaceholder"
          class="w-100 h-100 edit-id"
          style="
            border-radius: 0;
            color: rgb(255, 255, 255);
            background-color: #3f3f3f;
            border: 0px;
          "
        ></b-form-input>
      </span>
      <!-- original mockflow ID: cmpDc237ad838750762289b337e041a13b55_txt  -->
    </div>
    <!-- original mockflow ID: cmpDc237ad838750762289b337e041a13b55   -->
    <div
      v-show="!apikeyState"
      class="div__popdialog-form-controls-content-apikey-input-invalid-info"
    >
      {{ apikey_invalid_txt }}
    </div>
    <!-- original mockflow ID: cmpDc58af89b406eef99b252df101b6f3c55  -->
    <span
      v-show="is_addcustomer || is_editcustomer"
      class="span__popdialog-form-controls-content-idnickname"
      v-html="HTML_idnickname"
    >
    </span>
    <!-- original mockflow ID: cmpDbe6a35ad7872261f258623f4fb32055c  -->
    <div
      v-show="is_customer"
      class="div__popdialog-form-controls-content-idnickname-input-label"
      :class="[
        !curiaccountState
          ? 'div__popdialog-form-controls-content-idnickname-input-label-invalid'
          : 'div__popdialog-form-controls-content-idnickname-input-label-valid',
      ]"
      width="382"
      height="57"
    >
      <span class="span__popdialog-form-controls-content-idnickname-input-txt">
        <b-form-input
          id="input-curiaccount"
          v-model="curiaccount"
          spellcheck="false"
          :state="curiaccountState"
          aria-describedby="input-curiaccount-feedback"
          :placeholder="curiaccountplaceholder"
          class="w-100 h-100 edit-id"
          style="
            border-radius: 0;
            color: rgb(255, 255, 255);
            background-color: #3f3f3f;
            border: 0px;
          "
        ></b-form-input>
      </span>
      <!-- original mockflow ID: cmpDc6f33aeac0e5c24006c42c638b0f8879_txt  -->
    </div>
    <!-- original mockflow ID: cmpDc6f33aeac0e5c24006c42c638b0f8879  -->
    <div v-show="is_customer">
      <div
        v-show="!curiaccountState"
        class="div__popdialog-form-controls-content-idnickname-input-invalid"
      >
        {{ curiaccount_invalid_txt }}
      </div>
      <!-- original mockflow ID: cmpD456f91deecfb60d4fbe88aa135668f59  -->
    </div>
    <div>
      <!-- v-html="HTML_buttons">  -->
      <span
        v-show="is_addcustomer"
        class="span__popdialog-form-controls-cancel-btn"
        @click="cancel_addcustomer()"
        >Cancel</span
      >
      <span
        v-show="is_addcustomer"
        class="span__popdialog-form-controls-save-btn"
        :class="[
          allinputvalid
            ? 'span__popdialog-form-controls-save-btn-enable'
            : 'span__popdialog-form-controls-save-btn-disable',
        ]"
        @click="save_newcustomer()"
        >Save&nbsp;<wbr />ID</span
      >
      <span
        v-show="is_editcustomer"
        class="span__popdialog-form-controls-edit-cancel-btn"
        @click="cancel_editcustomer()"
        >Cancel</span
      >
      <span
        v-show="is_editcustomer"
        class="span__popdialog-form-controls-delete-btn"
        @click="delete_customer()"
        >Delete&nbsp;<wbr />ID</span
      >
      <span
        v-show="is_editcustomer"
        class="span__popdialog-form-controls-saveid-btn"
        :class="[
          allinputvalid
            ? 'span__popdialog-form-controls-save-btn-enable'
            : 'span__popdialog-form-controls-save-btn-disable',
        ]"
        @click="save_customer()"
        >Save&nbsp;<wbr />ID</span
      >
      <span
        v-show="is_adduser"
        class="span__popdialog-form-controls-user-cancel-btn"
        @click="cancel_adduser()"
        >Cancel</span
      >
      <span
        v-show="is_adduser"
        class="span__popdialog-form-controls-user-save-btn"
        :class="[
          firstsecondinputvalid
            ? 'span__popdialog-form-controls-save-btn-enable'
            : 'span__popdialog-form-controls-save-btn-disable',
        ]"
        @click="save_adduser()"
        >Save&nbsp;<wbr />ID</span
      >
      <span
        v-show="is_edituser"
        class="span__popdialog-form-controls-user-edit-cancel-btn"
        @click="cancel_edituser()"
        >Cancel</span
      >
      <span
        v-show="is_edituser"
        class="span__popdialog-form-controls-user-delete"
        @click="delete_user()"
        >Delete&nbsp;<wbr />ID</span
      >
      <span
        v-show="is_edituser"
        class="span__popdialog-form-controls-user-saveid-btn"
        :class="[
          firstsecondinputvalid
            ? 'span__popdialog-form-controls-save-btn-enable'
            : 'span__popdialog-form-controls-save-btn-disable',
        ]"
        @click="save_edituser()"
        >Save&nbsp;<wbr />ID</span
      >
    </div>
    <div
      unselectable="on"
      class="div__popdialog-form-controls-content-horizontal-line"
      group-id=""
      width="370"
      height="45"
    >
      <div
        class="div__popdialog-form-controls-content-horizontal-line-base"
        width="370"
        height="45"
      ></div>
      <!-- original mockflow ID: D0761b69af806690d6b89fee0614e87c1_base  -->
    </div>
    <!-- original mockflow ID: D0761b69af806690d6b89fee0614e87c1   -->
    <canvas
      class="canvas__popdialog-form-controls-common-horizontal-line"
      :class="canvas__popdialog_form_controls_common_horizontal_line_dynamic"
      width="482"
      height="14"
    >
    </canvas>
    <!-- original mockflow ID: cmpDeef60c88b3c45eb0a9341a125bf304d2  -->
    <div v-html="HTML_dividerlines"></div>
  </div>
</template>
<script>
import Vue from "vue";
import uuid from "@tofandel/uuid-base62";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";
Vue.use(uuid);

export default {
  name: "PopdialogForm",
  props: {
    category: { type: String, default: null }, // this prop can have value of "Add Customer/ Edit Customer/ Add User/ Edit User"
    dialogdata: { type: Object, default: null },
    dataindex: { type: Number, default: 0 },
  },
  data() {
    return {
      alphanumerickey: "",
      alphanumerickeyplaceholder: "2VSckkBYH2An3dqHEyfRRE",
      apikey: "",
      apikeyplaceholder: "",
      curiaccount: null,
      curiaccountplaceholder: "Curi Bio Main Account",
      alphanumeric_invalid_txt: "",
      apikey_invalid_txt: "",
      curiaccount_invalid_txt: "",
      nickname_validation: false,
      is_customer: false,
      is_addcustomer: false,
      is_editcustomer: false,
      is_adduser: false,
      is_edituser: false,
      edit_cust_id: 0,
      edit_userids: [],
      edit_user_focus_id: 0,
    };
  },
  computed: {
    HTML_contenttitle: function () {
      this.setisCustomer();
      if (this.category === "Add Customer") {
        return "Add&nbsp;<wbr />New&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID";
      }
      if (this.category === "Edit Customer") {
        this.setEditCustomer();
        return "Edit&nbsp;<wbr>Customer&nbsp;<wbr>Account&nbsp;<wbr>ID";
      }
      if (this.category === "Add User") {
        return "Add&nbsp;<wbr>New&nbsp;<wbr>User&nbsp;<wbr>ID";
      }
      if (this.category === "Edit User") {
        this.setEditUser();
        return "Edit&nbsp;<wbr>User&nbsp;<wbr>ID";
      }
      return "";
    },
    HTML_numericid: function () {
      this.setisCustomer();
      if (this.category === "Add Customer") {
        return "Enter&nbsp;<wbr />Alphanumeric&nbsp;<wbr />ID";
      }
      if (this.category === "Edit Customer") {
        return "Alphanumeric&nbsp;<wbr>ID";
      }
      if (this.category === "Add User") {
        return "Enter&nbsp;<wbr />Alphanumeric&nbsp;<wbr />ID";
      }
      if (this.category === "Edit User") {
        return "Alphanumeric&nbsp;<wbr>ID";
      }
      return "";
    },
    HTML_apikey: function () {
      this.setisCustomer();
      if (this.category === "Add Customer") {
        return "Enter&nbsp;<wbr />API&nbsp;<wbr />Key&nbsp;<wbr />(Optional)";
      }
      if (this.category === "Edit Customer") {
        return "API&nbsp;<wbr />Key&nbsp;<wbr />(Optional)";
      }
      if (this.category === "Add User") {
        return "Enter&nbsp;<wbr>ID&nbsp;<wbr>Nickname";
      }
      if (this.category === "Edit User") {
        return "ID&nbsp;<wbr />Nickname";
      }
      return "";
    },
    HTML_idnickname: function () {
      if (this.category === "Add Customer") {
        return "Enter&nbsp;<wbr />ID&nbsp;<wbr />Nickname";
      }
      if (this.category === "Edit Customer") {
        return "ID&nbsp;<wbr />Nickname";
      }
      return "";
    },
    HTML_dividerlines: function () {
      if (this.category === "Add Customer") {
        // cmpDc3311981cfe14cc02ce7012dffc4c8ff MockFlow UI canvas reference ID
        return '<canvas class="canvas__popdialog-form-controls-common-vertical-line" width="14" height="67"></canvas>';
      }
      if (this.category === "Edit Customer") {
        // cmpDe5f8a32e790941cfb973e24333c30c16 MockFlow UI canvas reference ID  cmpD62f716703ba8d8817c956a204b98b691 MockFlow UI reference ID
        return '<canvas class="canvas__popdialog-form-controls-one-line" width="14" height="67"> </canvas><canvas  class="canvas__popdialog-form-controls-two-line" width="14" height="67" > </canvas>';
      }
      if (this.category === "Add User") {
        return '<canvas class="canvas__popdialog-form-controls-common-user-vertical-line" width="14" height="67"></canvas>';
      }
      if (this.category === "Edit User") {
        return '<canvas class="canvas__popdialog-form-controls-user-one-line" width="14" height="67"> </canvas><canvas class="canvas__popdialog-form-controls-user-two-line" width="14" height="67" > </canvas>';
      }
      return "";
    },
    div__popdialog_form_controls_dynamic: function () {
      if (this.category === "Add Customer") {
        return "div__popdialog-form-controls-customer-account-id";
      }
      if (this.category === "Edit Customer") {
        return "div__popdialog-form-controls-customer-account-id";
      }
      if (this.category === "Add User") {
        return "div__popdialog-form-controls-user-account-id";
      }
      if (this.category === "Edit User") {
        return "div__popdialog-form-controls-user-account-id";
      }
      return "";
    },
    canvas__popdialog_form_controls_common_horizontal_line_dynamic: function () {
      if (this.category === "Add Customer") {
        return "canvas__popdialog-form-controls-common-horizontal-line-customer-account-id";
      }
      if (this.category === "Edit Customer") {
        return "canvas__popdialog-form-controls-common-horizontal-line-customer-account-id";
      }
      if (this.category === "Add User") {
        return "canvas__popdialog-form-controls-common-horizontal-line-user-account-id";
      }
      if (this.category === "Edit User") {
        return "canvas__popdialog-form-controls-common-horizontal-line-user-account-id";
      }
      return "";
    },
    alphanumerickeyState() {
      let validation = false;
      const len_alpahanumerickey = this.alphanumerickey.length;
      if (this.alphanumerickey.length == 22) {
        /* eslint-disable new-cap */
        uuid.customBase = new uuid.baseX(
          "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
        );
        /* eslint-enable new-cap */
        // decode the the value provided
        try {
          // decode the the value provided
          const decode_uuid = uuid.decode(this.alphanumerickey);
          const encode_uuid = uuid.encode(decode_uuid);
          if (encode_uuid === this.alphanumerickey) {
            this.uuid_errorfinder(len_alpahanumerickey, "valid");
            validation = true;
          } else {
            this.uuid_errorfinder(len_alpahanumerickey, "encoderror");
          }
        } catch (err) {
          this.uuid_errorfinder(len_alpahanumerickey, "error");
          validation = false;
        }
      } else {
        this.uuid_errorfinder(len_alpahanumerickey, "size");
      }
      return validation;
    },
    apikeyState() {
      let validation = false;
      if (this.category == "Add Customer" || this.category == "Edit Customer") {
        const apikey_len = this.apikey.length;
        if (apikey_len == 36) {
          /* eslint-disable new-cap */
          uuid.customBase = new uuid.baseX(
            "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
          );
          /* eslint-enable new-cap */
          // encode the the value provided
          try {
            const encode_uuid = uuid.encode(this.apikey);
            const decode_uuid = uuid.decode(encode_uuid);
            if (decode_uuid === this.apikey) {
              validation = true;
              this.apikey_errorfinder("valid");
            }
          } catch (err) {
            validation = false;
            this.apikey_errorfinder("error");
          }
        } else {
          if (apikey_len == 0) {
            validation = true;
          } else {
            if (apikey_len > 36) {
              validation = false;
              this.apikey_errorfinder("error");
            }
            if (apikey_len <= 35) {
              validation = false;
              this.apikey_errorfinder("error");
            }
          }
        }
      }
      if (this.category == "Add User" || this.category == "Edit User") {
        if (this.apikey != null) {
          const len_apikey = this.apikey.length;
          if (len_apikey >= 1 && len_apikey <= 20) {
            validation = true;
            validation = this.useraccount_errorfinder(validation, len_apikey);
          } else {
            validation = false;
            validation = this.useraccount_errorfinder(validation, len_apikey);
          }
        } else {
          validation = this.useraccount_errorfinder(validation, 0);
        }
      }
      return validation;
    },
    curiaccountState() {
      let validation = false;
      if (this.curiaccount != null) {
        const len_curiaccount = this.curiaccount.length;
        if (len_curiaccount >= 1 && len_curiaccount <= 20) {
          /* eslint-disable vue/no-side-effects-in-computed-properties */
          /* NOTE There are two JEST Unit Testcases which are valid scenarios will fail if we don't use this.nick_validation
               so the ESlint rules have to be disabled: The functionality is not effected due to this in the code so the eslint rules are disabled
               JEST testcases over-rules Eslint */
          this.nickname_validation = true;
          this.nickname_validation = this.curiaccount_errorfinder(
            this.nickname_validation,
            len_curiaccount
          );
        } else {
          this.nickname_validation = false;
          this.nickname_validation = this.curiaccount_errorfinder(
            this.nickname_validation,
            len_curiaccount
          );
        }
      } else {
        this.nickname_validation = this.curiaccount_errorfinder(
          this.nickname_validation,
          0
        );
      }
      validation = this.nickname_validation;
      /* eslint-enable vue/no-side-effects-in-computed-properties */
      return validation;
    },
    allinputvalid() {
      if (this.alphanumerickey.length == 22) {
        if (this.alphanumerickeyState == true) {
          if (this.apikey.length == 0 || this.apikey.length == 36) {
            if (this.apikeyState == true) {
              if (this.curiaccount != null) {
                const len_curiaccount = this.curiaccount.length;
                if (len_curiaccount >= 1 && len_curiaccount <= 20) {
                  if (this.curiaccountState == true) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
      return false;
    },
    firstsecondinputvalid() {
      // this is just a representational function and the logic to build the UI/UX CSS properties.
      if (this.alphanumerickey.length == 22) {
        if (this.alphanumerickeyState == true) {
          const len_usernickname = this.apikey.length;
          if (len_usernickname >= 1 && len_usernickname <= 20) {
            if (this.apikeyState == true) {
              return true;
            }
          }
        }
      }
      return false;
    },
  },
  methods: {
    cancel_addcustomer() {
      this.$bvModal.hide("add-customer");
    },
    save_newcustomer() {
      const add_customer = {
        cust_id: this.dataindex,
        uuid: this.alphanumerickey,
        api_key: this.apikey,
        nickname: this.curiaccount,
        user_ids: [],
      };
      this.$emit("save-id", add_customer);
      this.$bvModal.hide("add-customer");
    },
    cancel_editcustomer() {
      this.$bvModal.hide("edit-customer");
    },
    delete_customer() {
      const edit_customer = {
        cust_id: this.dataindex,
        uuid: this.alphanumerickey,
        api_key: this.apikey,
        nickname: this.curiaccount,
        user_ids: this.edit_userids,
      };
      this.$bvModal.hide("edit-customer");
      this.$emit("delete-id", edit_customer);
    },
    save_customer() {
      const edit_customer = {
        cust_id: this.dataindex,
        uuid: this.alphanumerickey,
        api_key: this.apikey,
        nickname: this.curiaccount,
        user_ids: this.edit_userids,
      };
      this.$emit("save-id", edit_customer);
      this.$bvModal.hide("edit-customer");
    },
    cancel_adduser() {
      this.$bvModal.hide("add-user");
    },
    save_adduser() {
      const add_user = {
        user_id: this.dataindex,
        uuid: this.alphanumerickey,
        nickname: this.apikey,
      };
      this.$emit("save-id", add_user);
      this.$bvModal.hide("add-user");
    },
    cancel_edituser() {
      this.$bvModal.hide("edit-user");
    },
    delete_user() {
      const delete_user = {
        user_id: this.dataindex,
        uuid: this.alphanumerickey,
        nickname: this.apikey,
      };
      this.$emit("delete-id", delete_user);
      this.$bvModal.hide("edit-user");
    },
    save_edituser() {
      const edit_user = {
        user_id: this.dataindex,
        uuid: this.alphanumerickey,
        nickname: this.apikey,
      };
      this.$emit("save-id", edit_user);
      this.$bvModal.hide("edit-user");
    },
    setisCustomer() {
      if (this.category === "Add Customer") {
        this.is_customer = true;
        this.is_addcustomer = true;
        this.is_editcustomer = false;
        this.is_adduser = false;
        this.is_edituser = false;
        this.apikeyplaceholder = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
      }
      if (this.category === "Edit Customer") {
        this.is_customer = true;
        this.is_addcustomer = false;
        this.is_editcustomer = true;
        this.is_adduser = false;
        this.is_edituser = false;
        this.apikeyplaceholder = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
      }
      if (this.category === "Add User") {
        this.is_customer = false;
        this.is_addcustomer = false;
        this.is_editcustomer = false;
        this.is_adduser = true;
        this.is_edituser = false;
        this.apikeyplaceholder = "User Name";
      }
      if (this.category === "Edit User") {
        this.is_customer = false;
        this.is_addcustomer = false;
        this.is_editcustomer = false;
        this.is_adduser = false;
        this.is_edituser = true;
        this.apikeyplaceholder = "User Name";
      }
    },
    setEditCustomer() {
      if (this.dialogdata != null) {
        this.edit_cust_id = this.dialogdata.cust_id;
        this.alphanumerickey = this.dialogdata.uuid;
        this.apikey = this.dialogdata.api_key;
        this.curiaccount = this.dialogdata.nickname;
        this.edit_userids = this.dialogdata.user_ids;
      }
    },
    setEditUser() {
      if (this.dialogdata != null) {
        this.edit_user_focus_id = this.dialogdata.user_id;
        this.alphanumerickey = this.dialogdata.uuid;
        this.apikey = this.dialogdata.nickname;
      }
    },
    uuid_errorfinder(len, source) {
      let invalid_builder = "";
      let error = false;
      for (let i = 0; i < this.alphanumerickey.length; i++) {
        const scan_ascii = this.alphanumerickey.charCodeAt(i);
        if (scan_ascii === 48) {
          invalid_builder = invalid_builder + "0";
          error = true;
        }
        if (scan_ascii === 49) {
          invalid_builder = invalid_builder + "1";
          error = true;
        }
        if (scan_ascii === 73) {
          invalid_builder = invalid_builder + "I";
          error = true;
        }
        if (scan_ascii === 108) {
          invalid_builder = invalid_builder + "l";
          error = true;
        }
        if (scan_ascii === 79) {
          invalid_builder = invalid_builder + "O";
          error = true;
        }
        if (error === true) {
          invalid_builder = invalid_builder + ",";
          error = false;
        }
      }
      if (len < 22) {
        if (len == 0) {
          this.alphanumeric_invalid_txt = "This field is required";
        } else {
          this.alphanumeric_invalid_txt =
            "The entered ID is " +
            len +
            " characters. All valid IDs are exactly 22 characters.";
        }
      } else {
        if (invalid_builder != "") {
          this.alphanumeric_invalid_txt =
            "The entered ID has an invalid character " + invalid_builder;
        } else {
          if (source == "error") {
            this.alphanumeric_invalid_txt =
              "Entry permitted for Alphanumeric only";
          } else {
            if (source == "encoderror") {
              this.alphanumeric_invalid_txt =
                "This combination of 22 characters is invalid encoded id";
            } else {
              this.alphanumeric_invalid_txt = "";
            }
          }
        }
      }
      if (len > 22) {
        this.alphanumeric_invalid_txt =
          "The entered ID is " +
          len +
          " characters. All valid IDs are exactly 22 characters.";
      }
    },
    apikey_errorfinder(stats) {
      switch (stats) {
        case "valid":
          this.apikey_invalid_txt = "";
          break;
        case "error":
          this.apikey_invalid_txt = "Wrong Format of API Key";
          break;
      }
    },
    nickname_parser(stats, len) {
      let parser_status = true;
      for (let i = 0; i < len; i++) {
        let scan_ascii = 0;
        if (this.is_customer == true) {
          scan_ascii = this.curiaccount.charCodeAt(i);
        } else {
          scan_ascii = this.apikey.charCodeAt(i);
        }
        switch (true) {
          case scan_ascii == 32: /* space          */
          case scan_ascii == 35: /* hash       #   */
          case scan_ascii == 38: /* ampersand     & */
          case scan_ascii == 40: /* parantheses (  */
          case scan_ascii == 41: /* parantheses )  */
          case scan_ascii == 45: /* hypen     -    */
          case scan_ascii == 46: /*  period     .   */
          case scan_ascii == 47: /*  forward slash / */
          case scan_ascii >= 48 &&
            scan_ascii <=
              57: /* 0, 1, 2, 3, 4, 5, 6, 7, 8, 9  ascii of '0' is 48 and '9' is 57*/
          case scan_ascii >= 65 &&
            scan_ascii <= 90: /* A ascii of 'A' is 65  Z ascii of 'Z' is 90 */
          case scan_ascii == 95: /* underscore _   */
          case scan_ascii >= 97 && scan_ascii <= 122:
            if (this.is_customer == true) {
              this.curiaccount_invalid_txt = "";
            } else {
              this.apikey_invalid_txt = "";
            }
            break;
          case scan_ascii <= 31:
          case scan_ascii == 33:
          case scan_ascii == 34:
          case scan_ascii == 36:
          case scan_ascii == 37:
          case scan_ascii == 39:
          case scan_ascii >= 42 && scan_ascii <= 44:
          case scan_ascii >= 58 && scan_ascii <= 64:
          case scan_ascii >= 91 && scan_ascii <= 94:
          case scan_ascii == 96:
          case scan_ascii >= 123:
            if (this.is_customer == true) {
              this.curiaccount_invalid_txt =
                "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /";
            } else {
              this.apikey_invalid_txt =
                "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /";
            }
            i = len + 1;
            parser_status = false;
            break;
        }
      }
      return parser_status;
    },
    curiaccount_errorfinder(stats, len) {
      switch (stats) {
        case true:
          this.curiaccount_invalid_txt = "";
          break;
        case false:
          if (len == 0) {
            this.curiaccount_invalid_txt = "This field is required";
          } else {
            this.curiaccount_invalid_txt =
              "The valid nickname is min 1 charcter and max 20 charcters";
          }
          if (len > 20) {
            this.curiaccount_invalid_txt =
              "Invalid as its more than 20 charcters";
          }
          break;
      }
      if (stats == true) {
        if (len > 0 && len < 21) {
          stats = this.nickname_parser(stats, len);
        }
      }
      this.nickname_validation = stats;
      return stats;
    },
    useraccount_errorfinder(stats, len) {
      switch (stats) {
        case true:
          this.apikey_invalid_txt = "";
          break;
        case false:
          if (len == 0) {
            this.apikey_invalid_txt = "This field is required";
          } else {
            this.apikey_invalid_txt =
              "The valid nickname is min 1 charcter and max 20 charcters";
          }
          if (len > 20) {
            this.apikey_invalid_txt = "Invalid as its more than 20 charcters";
          }
          break;
      }
      if (stats == true) {
        if (len > 0 && len < 21) {
          stats = this.nickname_parser(stats, len);
        }
      }
      this.nickname_validation = stats;
      return stats;
    },
  },
};
</script>
<style type="text/css">
.div__popdialog-form-controls {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 500px;
  height: 0px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
.div__popdialog-form-controls-customer-account-id {
  height: 401px;
}

.div__popdialog-form-controls-user-account-id {
  height: 307px;
}

.span__popdialog-form-controls-content-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 370px;
  height: 30px;
  top: 17px;
  left: 50.5px;
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
  z-index: 21;
}

.span__popdialog-form-controls-content-numericid-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 275px;
  height: 30px;
  top: 50px;
  left: 108px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 25;
}

.div__popdialog-form-controls-content-numericid-input {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 390px;
  height: 45px;
  top: 83px;
  left: 49.5px;
  visibility: visible;
  z-index: 7;
  background-color: #1c1c1c;
}

.div__popdialog-form-controls-content-numericid-input--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__popdialog-form-controls-content-numericid-input--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}
.span__popdialog-form-controls-content-numericid-input-txt {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 390px;
  height: 45px;
  line-height: 45px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: "Anonymous Pro";
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  background-color: #2f2f2f;
}

.span__popdialog-form-controls-content-apikey-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 275px;
  height: 30px;
  top: 145px;
  left: 108px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 7;
}

.div__popdialog-form-controls-content-apikey-input {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 390px;
  height: 45px;
  top: 178px;
  left: 49.5px;
  visibility: visible;
  z-index: 5;
}
.div__popdialog-form-controls-content-apikey-input--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__popdialog-form-controls-content-apikey-input--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.span__popdialog-form-controls-content-apikey-input-txt {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 390px;
  height: 45px;
  line-height: 45px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  background-color: #2f2f2f;
}

.span__popdialog-form-controls-content-apikey-input-txt-customer-enable {
  font-family: "Anonymous Pro";
}
.span__popdialog-form-controls-content-apikey-input-txt-user-enable {
  font-family: Muli;
}

.span__popdialog-form-controls-content-idnickname {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 214px;
  height: 30px;
  top: 241px;
  left: 128.5px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 9;
}

.div__popdialog-form-controls-content-idnickname-input-label {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 390px;
  height: 45px;
  top: 274px;
  left: 50px;
  visibility: visible;
  z-index: 7;
}
.div__popdialog-form-controls-content-idnickname-input-label-invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}
.div__popdialog-form-controls-content-idnickname-input-label-valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}
.span__popdialog-form-controls-content-idnickname-input-txt {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 390px;
  height: 45px;
  line-height: 45px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(255, 255, 255);
  background-color: #2f2f2f;
}

.span__popdialog-form-controls-cancel-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
  height: 30px;
  top: 358px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 19;
}
.span__popdialog-form-controls-cancel-btn:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-save-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
  height: 30px;
  top: 358px;
  left: 250px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  text-align: center;
  z-index: 3;
}

.span__popdialog-form-controls-save-btn-enable {
  color: rgb(255, 255, 255);
}
.span__popdialog-form-controls-save-btn-enable:hover {
  color: #19ac8a;
}
.span__popdialog-form-controls-save-btn-disable {
  color: rgb(63, 63, 63);
}

.div__popdialog-form-controls-content-horizontal-line {
  overflow: hidden;
  transform: rotate(0deg);
  user-select: none;
  position: absolute;
  width: 370px;
  height: 45px;
  top: 280px;
  left: 55.5px;
  z-index: 12;
  visibility: visible;
  display: none;
  background-color: rgba(0, 0, 0, 0);
}

.div__popdialog-form-controls-content-horizontal-line-base {
  -webkit-transform: translateZ(0);
  background-color: #878d99;
  opacity: 0;
  border: 0px solid;
  position: absolute;
  width: 370px;
  height: 45px;
  top: 0px;
  left: 0px;
  z-index: 13;
}

.canvas__popdialog-form-controls-common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 490px;
  height: 2px;
  top: 0px;
  left: 5px;
  visibility: visible;
  z-index: 13;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.canvas__popdialog-form-controls-common-horizontal-line-customer-account-id {
  top: 343px;
}

.canvas__popdialog-form-controls-common-horizontal-line-user-account-id {
  top: 250px;
}
.canvas__popdialog-form-controls-common-vertical-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 343px;
  left: 250px;
  visibility: visible;
  z-index: 15;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.canvas__popdialog-form-controls-common-user-vertical-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 250px;
  left: 250px;
  visibility: visible;
  z-index: 15;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.span__popdialog-form-controls-edit-cancel-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.6px;
  height: 30px;
  top: 358px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 25;
}
.span__popdialog-form-controls-edit-cancel-btn:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-user-edit-cancel-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 260px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 25;
}
.span__popdialog-form-controls-user-edit-cancel-btn:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-user-delete {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 260px;
  left: 166.66px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 29;
}
.span__popdialog-form-controls-user-delete:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-delete-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 358px;
  left: 166.66px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 29;
}
.span__popdialog-form-controls-delete-btn:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-saveid-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 358px;
  left: 333.33px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  text-align: center;
  z-index: 23;
}
.span__popdialog-form-controls-user-saveid-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 260px;
  left: 333.32px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  text-align: center;
  z-index: 23;
}
.canvas__popdialog-form-controls-one-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 343px;
  left: 166.66px;
  visibility: visible;
  z-index: 21;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.canvas__popdialog-form-controls-user-one-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 250px;
  left: 166.66px;
  visibility: visible;
  z-index: 21;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.canvas__popdialog-form-controls-two-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 343px;
  left: 333.32px;
  visibility: visible;
  z-index: 27;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.canvas__popdialog-form-controls-user-two-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 55px;
  top: 250px;
  left: 333.32px;
  visibility: visible;
  z-index: 27;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.div__popdialog-form-controls-content-numericid-input-invalid-info {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  top: 133px;
  left: 49.5px;
  width: 370px;
  height: 13px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: left;
  font-size: 10px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 17;
  pointer-events: all;
}

.div__popdialog-form-controls-content-apikey-input-invalid-info {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  top: 228px;
  left: 49.5px;
  width: 370px;
  height: 13px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: left;
  font-size: 10px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 7;
  pointer-events: all;
}
.div__popdialog-form-controls-content-idnickname-input-invalid {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  top: 324px;
  left: 49.5px;
  width: 370px;
  height: 13px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: left;
  font-size: 10px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  z-index: 15;
  pointer-events: all;
}
.span__popdialog-form-controls-user-cancel-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
  height: 30px;
  top: 260px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 21;
}
.span__popdialog-form-controls-user-cancel-btn:hover {
  color: rgb(189 53 50);
}
.span__popdialog-form-controls-user-save-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
  height: 30px;
  top: 260px;
  left: 250px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  text-align: center;
  z-index: 19;
}

/* Over ride the bootstrap default color for  valid (tick) alert from #28a745 to the one matching the mockflow value #19ac8a */
.form-control.is-valid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2319ac8a' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
}
/* Over ride the bootstrap default color for  valid (stop exclamatory) alert from #dc3545 to the one matching the mockflow value #bd3532 */
.form-control.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23bd3532' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23bd3532' stroke='none'/%3e%3c/svg%3e");
}
</style>
