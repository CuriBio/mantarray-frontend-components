<template>
  <div>
    <div class="div__AddUser-form-controls"></div>
    <span class="span__AddUser-form-controls-content-title"> Add&nbsp;<wbr />New&nbsp;<wbr />User </span>
    <div id="customer_id" style="top: 50px; left: 50px; position: absolute; z-index: 24">
      <InputWidget
        :title_label="'Enter Customer ID'"
        :placeholder="'ba86b8f0-6fdf-4944-87a0-8a491a19490e'"
        :invalid_text="error_text_id"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'customer-id'"
        :initial_value="stored_customer_id"
        @update:value="on_update_id($event)"
      ></InputWidget>
    </div>

    <div id="user_name" style="top: 184px; left: 50px; position: absolute; z-index: 23">
      <span class="span__input-user-title">Enter&nbsp;<wbr />Username</span>
      <InputDropDown
        :placeholder="'Curi Bio User'"
        :invalid_text="error_text_user_name"
        :input_width="400"
        :options_text="stored_usernames"
        :message_if_invalid="error_text_user_name != ''"
        :options_id="'username'"
        :input_background_color="'rgb(63, 63, 63)'"
        :container_background_color="'#111'"
        :value.sync="user_name"
        @update:value="on_update_user_name($event)"
      />
    </div>
    <div id="pass-key" style="top: 241px; left: 50px; position: absolute; z-index: 22">
      <InputWidget
        :title_label="'Enter Password'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_pass"
        :spellcheck="false"
        :input_width="400"
        :type="'password'"
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
        :button_names="['Cancel', 'Save ID']"
        :hover_color="['#bd4932', '#19ac8a']"
        :is_enabled="enablelist_add_user"
        @btn-click="clicked_button"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
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
import InputDropDown from "@/components/basic_widgets/InputDropDown.vue";

export default {
  name: "AddUser",
  components: {
    InputWidget,
    ButtonWidget,
    InputDropDown,
  },
  data() {
    return {
      customer_id: "",
      user_password: "",
      user_name: "",
      error_text_id: "This field is required",
      error_text_pass: "This field is required",
      error_text_user_name: "This field is required",
      enablelist_add_user: [true, false],
    };
  },
  computed: {
    ...mapState("settings", ["stored_customer_id", "stored_usernames"]),
  },
  created: function () {
    if (this.stored_customer_id) this.on_update_id(this.stored_customer_id);
  },
  methods: {
    on_update_id: function (new_value) {
      this.error_text_id = TextValidation_User.validate(new_value, "ID");
      this.customer_id = new_value;
      this.enable_save_button();
    },
    on_update_pass: function (new_value) {
      this.error_text_pass = TextValidation_User.validate(new_value, "passkey");
      this.user_password = new_value;
      this.enable_save_button();
    },
    on_update_user_name: function (new_value) {
      this.error_text_user_name = TextValidation_User.validate(new_value, "user_name");
      this.user_name = new_value;
      this.enable_save_button();
    },
    clicked_button: function (choice) {
      switch (choice) {
        case 0:
          this.cancel_add_user();
          break;
        case 1:
          this.save_newuser();
          break;
      }
    },
    cancel_add_user() {
      this.$emit("cancel-id");
    },
    save_newuser() {
      const add_user = {
        customer_id: this.customer_id,
        user_password: this.user_password,
        user_name: this.user_name,
      };
      this.$emit("save-id", add_user);
    },
    enable_save_button() {
      if (this.error_text_id === "") {
        if (this.error_text_pass === "") {
          if (this.error_text_user_name === "") {
            this.enablelist_add_user = [true, true];
            return;
          }
        }
      }
      this.enablelist_add_user = [true, false];
    },
  },
};
</script>
<style type="text/css">
.div__AddUser-form-controls {
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
.span__AddUser-form-controls-content-title {
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
.span__input-user-title {
  position: absolute;
  top: -34px;
  color: #b7b7b7;
  width: 400px;
  justify-content: center;
  display: flex;
  font-size: 17px;
}
</style>
