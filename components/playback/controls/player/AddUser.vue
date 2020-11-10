<template>
  <div>
    <div class="div__adduser-form-controls"></div>
    <span class="span__adduser-form-controls-content-title">
      Add&nbsp;<wbr />New&nbsp;<wbr />User&nbsp;<wbr />ID
    </span>
    <div id="uuid" style="top: 40px; left: 50px; position: absolute">
      <InputWidget
        :title_label="'Enter Alphanumeric ID'"
        :placeholder="'2VSckkBYr2An3dqHEyfRRE'"
        :invalid_text="error_text_uuid"
        :spellcheck="false"
        :input_width="400"
        :dom_id_suffix="'alphanumeric-id'"
        @update:value="on_update_uuid($event)"
      ></InputWidget>
    </div>

    <div id="nickname" style="top: 140px; left: 50px; position: absolute">
      <InputWidget
        :title_label="'Enter ID Nickname'"
        :placeholder="'Curi Bio Main Account'"
        :invalid_text="error_text_nickname"
        :input_width="400"
        :dom_id_suffix="'nickname-id'"
        @update:value="on_update_nickname($event)"
      ></InputWidget>
    </div>
    <div style="top: 254px; left: 0px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="['Cancel', 'Save ID']"
        :hover_color="['#BD4932', '#19ac8a']"
        :is_enabled="enablelist_add_customer"
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

const TextValidation_Nickname = new TextValidation("nickname");
export default {
  name: "AddUser",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    dataindex: { type: Number, default: 0 },
  },
  data() {
    return {
      uuid: "",
      nickname: "",
      error_text_uuid: "This field is required",
      error_text_nickname: "This field is required",
      enablelist_add_customer: [true, false],
    };
  },
  methods: {
    on_update_uuid: function (new_value) {
      this.error_text_uuid = TextValidation_UUIDBase57.validate(new_value);
      this.uuid = new_value;
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
          this.cancel_adduser();
          break;
        case 1:
          this.save_adduser();
          break;
      }
    },
    cancel_adduser() {
      this.$bvModal.hide("add-user");
    },
    save_adduser() {
      const add_user = {
        user_id: this.dataindex,
        uuid: this.uuid,
        nickname: this.nickname,
      };
      this.$emit("save-id", add_user);
      this.$bvModal.hide("add-user");
    },
    enable_save_button() {
      if (this.error_text_uuid === "") {
        if (this.error_text_nickname === "") {
          this.enablelist_add_customer = [true, true];
          return;
        }
      }
      this.enablelist_add_customer = [true, false];
    },
  },
};
</script>
<style type="text/css">
.div__adduser-form-controls {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 500px;
  height: 307px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
.span__adduser-form-controls-content-title {
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
/* Over ride the bootstrap default color for  valid (tick) alert from #28a745 to the one matching the mockflow value #19ac8a */
.form-control.is-valid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2319ac8a' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
}
/* Over ride the bootstrap default color for  valid (stop exclamatory) alert from #dc3545 to the one matching the mockflow value #bd3532 */
.form-control.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23bd3532' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23bd3532' stroke='none'/%3e%3c/svg%3e");
}
</style>
