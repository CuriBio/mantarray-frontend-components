<template>
  <div>
    <div class="div__editcustomer-form-controls"></div>
    <span class="span__editcustomer-form-controls-content-title">
      Edit&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID
    </span>
    <div
      id="uuid"
      style="top: 50px; left: 50px; position: absolute; z-index: 24"
    >
      <InputWidget
        :title_label="'Alphanumeric ID'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_uuid"
        :initial_value="uuid"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'alphanumeric-id'"
        @update:value="on_update_uuid($event)"
      ></InputWidget>
    </div>

    <div
      id="apikey"
      style="top: 145px; left: 50px; position: absolute; z-index: 23"
    >
      <InputWidget
        :title_label="'API Key (Optional)'"
        :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
        :invalid_text="error_text_api"
        :initial_value="apikey"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'apikey-id'"
        @update:value="on_update_api($event)"
      ></InputWidget>
    </div>
    <div
      id="nickname"
      style="top: 241px; left: 50px; position: absolute; z-index: 22"
    >
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
        :hover_color="['#BD4932', '#BD4932', '#19ac8a']"
        :is_enabled="enablelist_edit_customer"
        @btn-click="clicked_button"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import uuid from "@tofandel/uuid-base62";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import InputWidget from "@/components/playback/controls/player/InputWidget.vue";
import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";
import { TextValidation } from "@/js_utils/text_validation.js";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";
Vue.use(uuid);
const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");
const TextValidation_Alphanumeric = new TextValidation("alphanumeric");
const TextValidation_Nickname = new TextValidation("nickname");
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
      uuid: this.dialogdata.uuid,
      apikey: this.dialogdata.api_key,
      nickname: this.dialogdata.nickname,
      userids: this.dialogdata.userids,
      error_text_uuid: "",
      error_text_api: "",
      error_text_nickname: "",
      enablelist_edit_customer: [true, true, true],
    };
  },
  methods: {
    on_update_uuid: function (new_value) {
      this.error_text_uuid = TextValidation_UUIDBase57.validate(new_value);
      this.uuid = new_value;
      this.enable_save_button();
    },
    on_update_api: function (new_value) {
      this.error_text_api = TextValidation_Alphanumeric.validate(new_value);
      this.apikey = new_value;
      this.enable_save_button();
    },
    on_update_nickname: function (new_value) {
      this.error_text_nickname = TextValidation_Nickname.validate(new_value);
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
        cust_id: this.dataindex,
        uuid: this.uuid,
        api_key: this.apikey,
        nickname: this.nickname,
        user_ids: this.userids,
      };
      this.$emit("delete-id", edit_customer);
    },
    save_customer() {
      const edit_customer = {
        cust_id: this.dataindex,
        uuid: this.uuid,
        api_key: this.apikey,
        nickname: this.nickname,
        user_ids: this.userids,
      };
      this.$emit("save-id", edit_customer);
    },
    enable_save_button() {
      if (this.error_text_uuid === "") {
        if (this.error_text_api === "") {
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
/* Over ride the bootstrap default color for  valid (tick) alert from #28a745 to the one matching the mockflow value #19ac8a */
.form-control.is-valid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2319ac8a' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
}
/* Over ride the bootstrap default color for  valid (stop exclamatory) alert from #dc3545 to the one matching the mockflow value #bd3532 */
.form-control.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23bd3532' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23bd3532' stroke='none'/%3e%3c/svg%3e");
}
</style>
