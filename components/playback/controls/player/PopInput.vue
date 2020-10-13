<template>
  <div>
    <div class="div__popinput-background"></div>

    <span class="span__popinput-content-label">
      {{ title_label }}
      <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
    </span>

    <div
      class="div__popinput-controls-content-input-widget"
      :class="[
        !inputenterykeyState
          ? 'div__popinput-controls-content-input--invalid-widget'
          : 'div__popinput-controls-content-input--valid-widget',
      ]"
      width="382"
      height="57"
    >
      <span class="span__popinput-controls-content-input-txt-widget">
        <b-form-input
          id="input-widget"
          v-model="inputvaluekey"
          :spellcheck="input_check"
          :state="inputenterykeyState"
          aria-describedby="input-feedback"
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
      v-show="!inputenterykeyState"
      class="div__popinput-controls-content-input-feedback"
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
      inputvaluekey: this.user_key,
    };
  },
  computed: {
    inputenterykeyState: function () {
      this.$emit("update:user_key", this.inputvaluekey);
      return this.invalid_text === "";
    },
  },
  methods: {},
};
</script>
<style type="text/css">
.div__popinput-background {
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

.span__popinput-content-label {
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

.span__popinput-controls-content-input-txt-widget {
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

.div__popinput-controls-content-input-widget {
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

.div__popinput-controls-content-input--invalid-widget {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__popinput-controls-content-input--valid-widget {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__popinput-controls-content-input-feedback {
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
