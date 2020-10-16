<template>
  <div>
    <div
      class="div__input-background"
      :style="
        'width: ' +
        input_width_background +
        'px;' +
        'height: ' +
        input_height_background +
        'px;'
      "
    >
      <span
        v-if="title_label !== ''"
        class="span__input-content-label"
        :style="'width: ' + input_width + 'px;'"
      >
        {{ title_label }}
        <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
      </span>

      <div
        class="div__input-controls-content-widget"
        :class="[
          !input_key_action
            ? 'div__input-controls-content-widget--invalid'
            : 'div__input-controls-content-widget--valid',
        ]"
        :style="
          'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;'
        "
      >
        <span
          class="span__input-controls-content-input-txt-widget"
          :style="'width: ' + input_width + 'px;'"
        >
          <b-form-input
            id="input-widget"
            v-model="input_value_key"
            :spellcheck="spellcheck"
            :state="input_key_action"
            aria-describedby="input-feedback"
            :placeholder="placeholder"
            :disabled="disabled"
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
        class="div__input-controls-content-feedback"
        :style="
          'width: ' + input_width + 'px;' + 'top:' + input_feedback_top + 'px;'
        "
      >
        {{ invalid_text }}
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);
import "bootstrap/dist/css/bootstrap.min.css";
/* IMPORTANT NOTE ON UTILIZATION */
/* ==========================================================================================================================================*/
/* The Parent component which utilises the widget has to follow the rule when using on the dialogs or components.
   From the Mockflow page they need to extract the proper width on which the PopInput Widget has to appear and reduce the width by 4 pixels
   As the PopInput background introduces a border of 2px and surronding the <input> box the red and green validation boxes introduces 2px.
   Request you to consider for the prop assignment the following formula:-
   input_width = MockflowUI_width - 4
   ==========================================================================================================================================*/
export default {
  name: "PopInput",
  props: {
    title_label: { type: String, default: "" }, // title_text (str) (optional, defaults to empty string "")
    placeholder: { type: String, default: "" }, // placeholder (str)
    invalid_text: { type: String, default: "" }, // invalid_text (str)
    spellcheck: { type: Boolean, default: true }, // spellcheck (optional bool=True)
    value: { type: String, default: "" }, // field_value (str) (optional, defaults to empty string "")
    input_width: { type: Number, default: 0 }, // textbox_width (int)  [pixels]
    disabled: { type: Boolean, default: false }, // disabled (optional bool=False) (not able to type into input)
  },
  data() {
    return {
      input_value_key: this.value,
      input_width_background: this.input_width + 4, // This is required as the red/green boxes around the input widget requirement based on feedback introduced the need its not in Mockflow
      // very essential else the input box would appear poping out on the right side outside the background, request to consult Eli or Raghu
    };
  },
  computed: {
    input_key_action: function () {
      // This is a very sensitive computed function as its invoked on every key entry by user action
      // the function would never have any processing its only responsible to pass the value of string to the parent component
      // any modification to add logic might impact depedent functionalities, request to consult Eli or Raghu
      this.$emit("update:value", this.input_value_key);
      return this.invalid_text === "";
    },
    input_height_background: function () {
      return this.title_label !== "" ? 100 : 60;
    },
    input_widget_top: function () {
      return this.title_label !== "" ? 40 : 0;
    },
    input_feedback_top: function () {
      return this.title_label !== "" ? 88 : 48;
    },
  },
  methods: {},
};
</script>
<style type="text/css">
.div__input-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__input-content-label {
  pointer-events: all;
  align: center;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  height: 30px;
  top: 0px;
  left: 5px;
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

.span__input-controls-content-input-txt-widget {
  padding-left: 0px;
  padding-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
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

.div__input-controls-content-widget {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  height: 45px;
  left: 0px;
  visibility: visible;
  z-index: 7;
  background-color: #1c1c1c;
}

.div__input-controls-content-widget--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__input-controls-content-widget--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__input-controls-content-feedback {
  line-height: 1;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(229, 74, 74);
  font-family: Muli;
  position: absolute;
  left: 0px;
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
