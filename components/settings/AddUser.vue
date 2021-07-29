<template>
  <div>
    <div class="div__adduser-form-controls"></div>
    <span class="span__adduser-form-controls-content-title">
      Add&nbsp;<wbr />New&nbsp;<wbr />User&nbsp;<wbr />ID
    </span>
    <div id="uuid" style="top: 50px; left: 50px; position: absolute; z-index: 24">
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

    <div id="nickname" style="top: 145px; left: 50px; position: absolute; z-index: 23">
      <InputWidget
        :title_label="'Enter ID Nickname'"
        :placeholder="'Marie Curie'"
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
import uuid from "@tofandel/uuid-base62";
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
      enablelist_add_user: [true, false],
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
      this.$emit("cancel-id");
    },
    save_adduser() {
      const add_user = {
        user_id: this.dataindex,
        uuid: this.uuid,
        nickname: this.nickname,
      };
      this.$emit("save-id", add_user);
    },
    enable_save_button() {
      if (this.error_text_uuid === "") {
        if (this.error_text_nickname === "") {
          this.enablelist_add_user = [true, true];
          return;
        }
      }
      this.enablelist_add_user = [true, false];
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
