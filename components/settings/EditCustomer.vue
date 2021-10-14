<template>
  <div>
    <div class="div__editcustomer-form-controls"></div>
    <span class="span__editcustomer-form-controls-content-title">
      Edit&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID
    </span>
    <div id="uuid" style="top: 50px; left: 50px; position: absolute; z-index: 24">
      <InputWidget
        :title_label="'Alphanumeric ID'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_id"
        :initial_value="cust_id"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'alphanumeric-id'"
        @update:value="on_update_id($event)"
      ></InputWidget>
    </div>

    <div id="passkey" style="top: 145px; left: 50px; position: absolute; z-index: 23">
      <InputWidget
        :title_label="'pass Key'"
        :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
        :invalid_text="error_text_pass"
        :initial_value="pass_key"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'passkey-id'"
        @update:value="on_update_pass($event)"
      ></InputWidget>
    </div>
    <div id="nickname" style="top: 241px; left: 50px; position: absolute; z-index: 22">
      <InputWidget
        :title_label="'ID Nickname'"
        :placeholder="'Curi Bio Main Account'"
        :invalid_text="error_text_nickname"
        :initial_value="nickname"
        :input_width="400"
        :dom_id_suffix="'nickname-id'"
        @update:value="on_update_nickname($event)"
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
        :is_enabled="enablelist_edit_customer"
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
  name: "EditCustomer",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    dialogdata: { type: Object, default: null },
    dataindex: { type: Number, default: 0 },
  },
  data() {
    return {
      cust_id: this.dialogdata.cust_id,
      pass_key: this.dialogdata.pass_key,
      nickname: this.dialogdata.nickname,
      user_ids: this.dialogdata.user_ids,
      error_text_id: "",
      error_text_pass: "",
      error_text_nickname: "",
      enablelist_edit_customer: [true, true, true],
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
    on_update_nickname: function (new_value) {
      this.error_text_nickname = TextValidation_Customer.validate(new_value, "nickname");
      this.nickname = new_value;
      this.enable_save_button();
    },
    clicked_button: function (choice) {
      switch (choice) {
        case 0:
          this.cancel_editcustomer();
          break;
        case 1:
          this.delete_customer();
          break;
        case 2:
          this.save_customer();
          break;
      }
    },
    cancel_editcustomer() {
      this.$emit("cancel-id");
    },
    delete_customer() {
      const edit_customer = {
        cust_idx: this.dataindex,
        cust_id: this.cust_id,
        pass_key: this.pass_key,
        nickname: this.nickname,
        user_ids: this.user_ids,
      };
      this.$emit("delete-id", edit_customer);
    },
    save_customer() {
      const edit_customer = {
        cust_idx: this.dataindex,
        cust_id: this.cust_id,
        pass_key: this.pass_key,
        nickname: this.nickname,
        user_ids: this.user_ids,
      };
      this.$emit("save-id", edit_customer);
    },
    enable_save_button() {
      if (this.error_text_id === "") {
        if (this.error_text_pass === "") {
          if (this.error_text_nickname === "") {
            this.enablelist_edit_customer = [true, true, true];
            return;
          }
        }
      }
      this.enablelist_edit_customer = [true, true, false];
    },
  },
};
</script>
<style type="text/css">
.div__editcustomer-form-controls {
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
.span__editcustomer-form-controls-content-title {
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
.span__input-controls-content-input-txt-widget > #input-widget-field-nickname-id {
  font-family: Muli;
}
</style>
