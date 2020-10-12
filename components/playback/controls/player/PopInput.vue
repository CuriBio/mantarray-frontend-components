<template>
  <div>
    <div class="div__popdialog-form-controls-widget"></div>
    <!-- eslint-disable vue/no-v-html -->
    <span
      class="span__popdialog-form-controls-content-numericid-label-widget"
      v-html="HTML_numericid"
    >
      <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
    </span>
    <!--eslint-enable-->
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
      >
        <!-- eslint-disable  vue/no-mutating-props -->
        <b-form-input
          id="input-alphanumeric"
          v-model="user_key"
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
        <!--eslint-enable-->
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
    validation: { type: Boolean, default: false },
    // field_value: {type:String,default:""}
  },
  data() {
    return {
      alphanumerickey: "",
      // alphanumerickeyplaceholder: "place holder",
    };
  },
  computed: {
    HTML_numericid: function () {
      return this.title_label;
    },
    div__popdialog_form_controls_dynamic: function () {
      return "div__popdialog-form-controls-customer-account-id";
    },
    alphanumerickeyState() {
      // console.log('firing alphanumerickeyState')
      // if the invalid_text prop is set to blank/null then this component should consider the text VALID. Else should be invalid.
      // return this.invalid_text === ""

      // User types in text field.  PopInput emits event to parent.  Parent catches event and checks business logic. Parent updates invaild_text prop to either "" or a message.
      // Because the invalid_text prop changed, that triggers the computed function 'alphanumerickeyState' which returns a new value that is bound to the `state` attribute of the input.
      // Parent probably also needs to make sure to put the text it received back into the field_value prop so that the text in the input doesn't get cleared if the component re-renderes because of a prop update

      // double check for v-model version if it can go up to the Grandparent component if that is where the business logic lives

      // let validation = false;
      // if (this.alphanumerickey.length == 2) {
      //   validation = true;
      // }

      /*  The above description how current implementation is done between PopInput.vue <===> basic-input.vue  */
      /*  Functional and all other aspects of CSS as a widget its matching to Alphanumeric key validation logic */
      this.$emit("update:user_key", this.user_key);
      return this.validation;
    },
  },
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
