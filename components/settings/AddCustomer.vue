<template>
  <div>
    <div class="div__addcustomer-form-controls"></div>
    <span class="span__addcustomer-form-controls-content-title">
      Add&nbsp;<wbr />New&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID
    </span>
    <div id="uuid" style="top: 50px; left: 50px; position: absolute; z-index: 24">
      <InputWidget
        :title_label="'Enter Alphanumeric ID'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_id"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'alphanumeric-id'"
        @update:value="on_update_id($event)"
      ></InputWidget>
    </div>

    <div id="pass-key" style="top: 145px; left: 50px; position: absolute; z-index: 23">
      <InputWidget
        :title_label="'Enter Pass-Key'"
        :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
        :invalid_text="error_text_pass"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'passkey-id'"
        @update:value="on_update_pass($event)"
      ></InputWidget>
    </div>
    <div id="user_account_id" style="top: 241px; left: 50px; position: absolute; z-index: 22">
      <InputWidget
        :title_label="'Enter User Account ID'"
        :placeholder="'Curi Bio User'"
        :invalid_text="error_text_user_account_id"
        :input_width="400"
        :dom_id_suffix="'user-account-id'"
        @update:value="on_update_user_account_id($event)"
      ></InputWidget>
    </div>
    <div style="top: 350px; left: 0px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="['Cancel', 'Save ID']"
        :hover_color="['#bd4932', '#19ac8a']"
        :is_enabled="enablelist_add_customer"
        @btn-click="clicked_button"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
// import uuid from "@tofandel/uuid-base62";
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
// Vue.use(uuid);
const TextValidation_Customer = new TextValidation("customer_account_input");

export default {
  name: "AddCustomer",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    dataindex: { type: Number, default: 0 },
  },
  data() {
    return {
      cust_id: "",
      pass_key: "",
      user_account_id: "",
      error_text_id: "This field is required",
      error_text_pass: "This field is required",
      error_text_user_account_id: "This field is required",
      enablelist_add_customer: [true, false],
    };
  },
  methods: {
    on_update_id: function (new_value) {
      this.error_text_id = TextValidation_Customer.validate(new_value, "ID");
      this.cust_id = new_value;
      this.enable_save_button();
    },
    on_update_pass: function (new_value) {
      this.error_text_pass = TextValidation_Customer.validate(new_value, "passkey");
      this.pass_key = new_value;
      this.enable_save_button();
    },
    on_update_user_account_id: function (new_value) {
      this.error_text_user_account_id = TextValidation_Customer.validate(new_value, "user_account_id");
      this.user_account_id = new_value;
      this.enable_save_button();
    },
    clicked_button: function (choice) {
      switch (choice) {
        case 0:
          this.cancel_addcustomer();
          break;
        case 1:
          this.save_newcustomer();
          break;
      }
    },
    cancel_addcustomer() {
      this.$emit("cancel-id");
    },
    save_newcustomer() {
      const add_customer = {
        cust_idx: this.dataindex,
        cust_id: this.cust_id,
        pass_key: this.pass_key,
        user_account_id: this.user_account_id,
        user_ids: [],
      };
      this.$emit("save-id", add_customer);
    },
    enable_save_button() {
      if (this.error_text_id === "") {
        if (this.error_text_pass === "") {
          if (this.error_text_user_account_id === "") {
            this.enablelist_add_customer = [true, true];
            return;
          }
        }
      }
      this.enablelist_add_customer = [true, false];
    },
  },
};
</script>
<style type="text/css">
.div__addcustomer-form-controls {
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
.span__addcustomer-form-controls-content-title {
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
.span__input-controls-content-input-txt-widget > #input-widget-field-user_account_id-id {
  font-family: Muli;
}
</style>
