<template>
  <div>
    <div class="div__edituser-form-controls"></div>
    <span class="span__edituser-form-controls-content-title">
      Edit&nbsp;<wbr />User&nbsp;<wbr />Credentials
    </span>
    <div id="customer_id" style="top: 50px; left: 50px; position: absolute; z-index: 24">
      <InputWidget
        :title_label="'Customer ID'"
        :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
        :invalid_text="error_text_id"
        :initial_value="customer_id"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'customer-id'"
        @update:value="on_update_id($event)"
      ></InputWidget>
    </div>
    <div id="user_name" style="top: 145px; left: 50px; position: absolute; z-index: 23">
      <InputWidget
        :title_label="'Username'"
        :placeholder="'Curi Bio User'"
        :invalid_text="error_text_user_name"
        :initial_value="user_name"
        :input_width="400"
        :dom_id_suffix="'username'"
        @update:value="on_update_user_name($event)"
      ></InputWidget>
    </div>
    <div id="passkey" style="top: 241px; left: 50px; position: absolute; z-index: 22">
      <InputWidget
        :title_label="'Password'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_pass"
        :initial_value="user_password"
        :type="'password'"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'passkey-id'"
        @update:value="on_update_pass($event)"
      ></InputWidget>
    </div>
    <div style="top: 350px; left: 0px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="['Cancel', 'Delete ID', 'Save ID']"
        :hover_color="['#bd4932', '#bd4932', '#19ac8a']"
        :is_enabled="enablelist_edit_user"
        @btn-click="clicked_button"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { TextValidation } from "@/js_utils/text_validation.js";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";
const TextValidation_User = new TextValidation("user_account_input");

export default {
  name: "EditUser",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    dialogdata: { type: Object, default: null },
    open_for_invalid_creds: { type: Boolean, default: false },
  },
  data() {
    return {
      customer_id: this.dialogdata.customer_id,
      user_name: this.dialogdata.user_name,
      user_password: this.dialogdata.user_password,
      error_text_id: "",
      error_text_pass: "",
      error_text_user_name: "",
      enablelist_edit_user: [true, true, true],
    };
  },
  created() {
    if (this.open_for_invalid_creds) {
      this.error_text_id = "Invalid Customer ID, Username, or Password";
      this.error_text_pass = "Invalid Customer ID, Username, or Password";
      this.error_text_user_name = "Invalid Customer ID, Username, or Password";
      this.enablelist_edit_user = [true, true, false];
    }
  },
  methods: {
    on_update_id: function (new_value) {
      this.error_text_id = TextValidation_User.validate(new_value, "ID");
      if (this.open_for_invalid_creds && this.error_text_id.length === 0) {
        this.error_text_pass = "";
        this.error_text_user_name = "";
      }
      this.customer_id = new_value;
      this.enable_save_button();
    },
    on_update_pass: function (new_value) {
      this.error_text_pass = TextValidation_User.validate(new_value, "passkey");
      if (this.open_for_invalid_creds && this.error_text_pass.length === 0) {
        this.error_text_id = "";
        this.error_text_user_name = "";
      }
      this.user_password = new_value;
      this.enable_save_button();
    },
    on_update_user_name: function (new_value) {
      this.error_text_user_name = TextValidation_User.validate(new_value, "user_name");
      if (this.open_for_invalid_creds && this.error_text_user_name.length === 0) {
        this.error_text_id = "";
        this.error_text_pass = "";
      }
      this.user_name = new_value;
      this.enable_save_button();
    },
    clicked_button: function (choice) {
      switch (choice) {
        case 0:
          this.cancel_edituser();
          break;
        case 1:
          this.delete_user();
          break;
        case 2:
          this.save_user();
          break;
      }
    },
    cancel_edituser() {
      this.$emit("cancel-id");
    },
    delete_user() {
      this.$emit("delete-id");
    },
    save_user() {
      const edit_user = {
        customer_id: this.customer_id,
        user_password: this.user_password,
        user_name: this.user_name,
      };
      this.$emit("save-id", edit_user);
    },
    enable_save_button() {
      if (this.error_text_id === "") {
        if (this.error_text_pass === "") {
          if (this.error_text_user_name === "") {
            this.enablelist_edit_user = [true, true, true];
            return;
          }
        }
      }
      this.enablelist_edit_user = [true, true, false];
    },
  },
};
</script>
<style type="text/css">
.div__edituser-form-controls {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 500px;
  height: 401px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
.span__edituser-form-controls-content-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 500px;
  height: 30px;
  top: 17px;
  left: 0px;
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
.span__input-controls-content-input-txt-widget > #input-widget-field-username {
  font-family: Muli;
}
</style>
