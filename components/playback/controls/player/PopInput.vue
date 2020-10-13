<template>
  <div>
    <div class="div__popdialog-form-controls-widget"></div>

    <span class="span__popdialog-form-controls-content-numericid-label-widget">
      {{ title_label }}
      <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
    </span>

    <div
      class="div__popdialog-form-controls-content-numericid-input-widget"
      :class="[
        !alphanumerickeyState
          ? 'div__popdialog-form-controls-content-numericid-input--invalid-widget'
          : 'div__popdialog-form-controls-content-numericid-input--valid-widget',
      ]"
      width="382"
      height="57"
    >
      <span
        class="span__popdialog-form-controls-content-numericid-input-txt-widget"
        @modify="swap_alphanumeric_user_key()"
      >
        <b-form-input
          id="input-alphanumeric"
          v-model="alphanumerickey"
          :spellcheck="input_check"
          :state="alphanumerickeyState"
          aria-describedby="input-alphanumeric-feedback"
          :placeholder="key_placeholder"
          class="w-100 h-100 edit-id"
          style="
            border-radius: 0;
            color: rgb(255, 255, 255);
            background-color: #3f3f3f;
            border: 0px;
          "
        ></b-form-input>
      </span>
    </div>
    <div
      v-show="!alphanumerickeyState"
      class="div__popdialog-form-controls-content-numericid-input-invalid-info-widget"
    >
      {{ invalid_text }}
    </div>
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
  name: "Popinput",
  props: {
    title_label: { type: String, default: "" },
    key_placeholder: { type: String, default: "" },
    invalid_text: { type: String, default: "" },
    input_check: { type: Boolean, default: false },
    user_key: { type: String, default: "" },
    // field_value: {type:String,default:""}
  },
  data() {
    return {
      alphanumerickey: this.user_key,
      // alphanumerickeyplaceholder: "place holder",
    };
  },
  computed: {
    div__popdialog_form_controls_dynamic: function () {
      return "div__popdialog-form-controls-customer-account-id";
    },
    alphanumerickeyState: function () {
      this.$emit("update:user_key", this.alphanumerickey);
      return this.invalid_text === "";
    },
  },
  created() {
    this.internal_textbox_value = "";
  },
  mounted: function () {},
  methods: {},
};
</script>
<style type="text/css">
.div__popdialog-form-controls-widget {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 400px;
  height: 100px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__popdialog-form-controls-content-numericid-label-widget {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 275px;
  height: 30px;
  top: 0px;
  left: 75px;
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

.div__popdialog-form-controls-customer-account-id-widget {
  height: 50px;
}

.span__popdialog-form-controls-content-numericid-input-txt-widget {
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

.div__popdialog-form-controls-content-numericid-input-widget {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 390px;
  height: 45px;
  top: 40px;
  left: 5px;
  visibility: visible;
  z-index: 7;
  background-color: #1c1c1c;
}

.div__popdialog-form-controls-content-numericid-input--invalid-widget {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__popdialog-form-controls-content-numericid-input--valid-widget {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__popdialog-form-controls-content-numericid-input-invalid-info-widget {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  top: 88px;
  left: 5px;
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
</style>
