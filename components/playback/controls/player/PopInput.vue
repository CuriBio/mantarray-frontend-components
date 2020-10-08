<template>
  <div>
    <div
      class="div__popdialog-form-controls"
      :class="div__popdialog_form_controls_dynamic"
    ></div>
    <div
      class="div__popdialog-form-controls-content-numericid-input"
      :class="[
        !alphanumerickeyState
          ? 'div__popdialog-form-controls-content-numericid-input--invalid'
          : 'div__popdialog-form-controls-content-numericid-input--valid',
      ]"
      width="382"
      height="57"
    >
      <span class="span__popdialog-form-controls-content-numericid-input-txt">
        <b-form-input
          id="input-alphanumeric"
          v-model="alphanumerickey"
          spellcheck="false"
          :state="alphanumerickeyState"
          aria-describedby="input-alphanumeric-feedback"
          :placeholder="alphanumerickeyplaceholder"
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
      class="div__popdialog-form-controls-content-numericid-input-invalid-info"
    >
      {{ alphanumeric_invalid_txt }}
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
  props: {},
  data() {
    return {
      alphanumerickey: "",
      alphanumerickeyplaceholder: "place holder",
      alphanumeric_invalid_txt: "error",
    };
  },
  computed: {
    div__popdialog_form_controls_dynamic: function () {
      return "div__popdialog-form-controls-customer-account-id";
    },
    alphanumerickeyState() {
      let validation = false;
      if (this.alphanumerickey.length == 2) {
        validation = true;
      }
      return validation;
    },
  },
  methods: {},
};
</script>
<style type="text/css">
.div__popdialog-form-controls {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 400px;
  height: 0px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.div__popdialog-form-controls-customer-account-id {
  height: 50px;
}

.span__popdialog-form-controls-content-numericid-input-txt {
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

.div__popdialog-form-controls-content-numericid-input {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 390px;
  height: 45px;
  top: 2px;
  left: 5px;
  visibility: visible;
  z-index: 7;
  background-color: #1c1c1c;
}

.div__popdialog-form-controls-content-numericid-input--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__popdialog-form-controls-content-numericid-input--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__popdialog-form-controls-content-numericid-input-invalid-info {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  top: 52px;
  left: 2px;
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
