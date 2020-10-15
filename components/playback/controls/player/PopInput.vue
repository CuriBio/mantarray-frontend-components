<template>
  <div>
    <div
      class="div__popinput-background"
      :style="'--p-width: ' + input_width_background + 'px'"
    ></div>

    <span
      class="span__popinput-content-label"
      :style="'--p-width: ' + input_label_width + 'px'"
    >
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
      :style="'--p-width: ' + input_width + 'px'"
    >
      <span
        class="span__popinput-controls-content-input-txt-widget"
        :style="'--p-width: ' + input_width + 'px'"
      >
        <b-form-input
          id="input-widget"
          v-model="input_value_key"
          :spellcheck="input_check"
          :state="inputenterykeyState"
          aria-describedby="input-feedback"
          :placeholder="key_placeholder"
          :disabled="block"
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
      :style="'--p-width: ' + input_width + 'px'"
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
  name: "PopInput", // this just case in-senstive this even if you name as Popinput what we put in index.js matters.. not the
  props: {
    title_label: { type: String, default: "" },
    key_placeholder: { type: String, default: "" }, // The end user uses keyboard to enter either in desktop or laptop so its named as key
    invalid_text: { type: String, default: "" },
    input_check: { type: Boolean, default: false },
    user_key: { type: String, default: "" },
    input_width: { type: Number, default: 0 },
    block: { type: Boolean, default: false },
  },
  data() {
    return {
      input_value_key: this.user_key,
      input_width_background: this.input_width + 10,
      input_label_width: this.input_width * 0.68,
    };
  },
  computed: {
    inputenterykeyState: function () {
      this.$emit("update:user_key", this.input_value_key);
      return this.invalid_text === "";
    },
  },
  methods: {},
  // created: function() {
  //     this.$refs["input"].width = this.input_width;
  // },
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
  width: var(--p-width);
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
  width: var(--p-width);
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

.span__popinput-controls-content-input-txt-widget {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: var(--p-width);
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
  width: var(--p-width);
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
  width: var(--p-width);
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
