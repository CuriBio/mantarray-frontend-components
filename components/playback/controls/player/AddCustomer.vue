<template>
  <div>
    <div class="div__addcustomer-form-controls"></div>
    <span class="span__addcustomer-form-controls-content-title">
      Add&nbsp;<wbr />New&nbsp;<wbr />Customer&nbsp;<wbr />Account&nbsp;<wbr />ID
    </span>
    <div id="uuid" style="top: 40px; left: 50px; position: absolute">
      <InputWidget
        :title_label="label_uuid"
        :placeholder="keyplaceholder_encode"
        :spellcheck="spellchecking"
        :invalid_text="error_text_uuid"
        :input_width="entry_width"
        :disabled="disallow_entry"
        :dom_id_suffix="'alphanumeric-id'"
        @update:value="on_update_uuid($event)"
      ></InputWidget>
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
// import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";
import { TextValidation } from "@/js_utils/text_validation.js";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";
Vue.use(uuid);
const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");
// const TextValidation_Alphanumeric = new TextValidation("alphanumeric");
// const TextValidation_Nickname = new TextValidation("nickname");
export default {
  name: "AddCustomer",
  components: {
    InputWidget,
    // ButtonWidget,
  },
  props: {
    dialogdata: { type: Object, default: null },
    dataindex: { type: Number, default: 0 },
  },
  data() {
    return {
      error_text_uuid: "This field is required",
    };
  },
  created: function () {
    this.label_uuid = "Enter Alphanumeric ID";
    this.label_api = "Enter API Key(Optional)";
    this.label_nickname = "Enter ID Nickname";
    this.keyplaceholder_encode = "2VSckkBYr2An3dqHEyfRRE";
    this.keyplaceholder_uuid = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    this.keyplaceholder_nickname = "Curi Bio Main Account";
    this.spellchecking = false;

    this.error_text_api = "";
    this.error_text_nickname = "This field is required";
    this.key_validation = false;
    this.entry_width = 400;
    this.disallow_entry = false;
    this.btnnames_add_customer = ["Cancel", "Save ID"];
    this.enablelist_add_customer = [true, false];
    this.visiblecolor_add_customer = "#FFFFFF";
    this.hidecolor_add_customer = "#3F3F3F";
    this.hovercolors_add_customer = ["#BD4932", "#19ac8a"];
  },
  methods: {
    on_update_uuid: function (new_value) {
      this.error_text_uuid = TextValidation_UUIDBase57.validate(new_value);
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
