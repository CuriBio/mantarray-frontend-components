<template>
  <div>
    <div
      class="div__input-background"
      :style="'width: ' + input_width_background + 'px;' + 'height: ' + input_height_background + 'px;'"
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
        :class="get_validity_class()"
        :style="'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;'"
      >
        <span class="span__input-controls-content-input-txt-widget" :style="'width: ' + input_width + 'px;'">
          <b-form-input
            :id="'input-widget-field-' + dom_id_suffix"
            v-model="input_value"
            :spellcheck="spellcheck"
            :state="input_is_valid"
            aria-describedby="input-feedback"
            :placeholder="placeholder"
            :disabled="disabled"
            :onpaste="input_cut_paste"
            class="w-100 h-100 edit-id"
            style="border-radius: 0; color: rgb(255, 255, 255); background-color: #3f3f3f; border: 0px"
            @input="on_b_form_input"
          ></b-form-input>
        </span>
      </div>
      <div
        v-show="display_text_message"
        :id="'input-widget-feedback-' + dom_id_suffix"
        class="div__input-controls-content-feedback"
        :style="'width: ' + input_width + 'px;' + 'top:' + input_feedback_top + 'px;'"
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
  name: "InputWidget",
  props: {
    title_label: { type: String, default: "" }, // title_text (str) (optional, defaults to empty string "")
    placeholder: { type: String, default: "" }, // placeholder (str)
    invalid_text: { type: String, default: "" }, // invalid_text (str)
    spellcheck: { type: Boolean, default: true }, // spellcheck (optional bool=True)
    initial_value: { type: String, default: "" }, // field_value (str) (optional, defaults to empty string "")
    input_width: { type: Number, default: 0 }, // textbox_width (int)  [pixels]
    disabled: { type: Boolean, default: false }, // disabled (optional bool=False) (not able to type into input)
    dom_id_suffix: { type: String, default: "" }, // TODO (Eli 11/3/20): consider defaulting this to a random UUID if no value supplied
    display_text_message: { type: Boolean, default: true }, // display_text_message (boolean) if set to false would not render invalid_text
    disable_paste: { type: Boolean, default: false }, // disable_paste (boolean) if set to true would prevent cut and paste of text into input
    default_state: { type: Boolean, default: true },
  },
  data() {
    return {
      input_value: this.initial_value,
      input_width_background: this.input_width + 4, // This is required as the red/green boxes around the input widget requirement based on feedback introduced the need its not in Mockflow
      // very essential else the input box would appear poping out on the right side outside the background, request to consult Eli or Raghu
    };
  },

  computed: {
    input_is_valid: function () {
      if (this.default_state) return null;
      else return this.invalid_text === "";
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
    input_cut_paste: function () {
      return this.disable_paste == true ? "return false;" : "";
    },
  },
  methods: {
    on_b_form_input: function () {
      this.$emit("update:value", this.input_value);
    },
    get_validity_class: function () {
      if (this.default_state) return null;
      if (this.input_is_valid) return "div__input-controls-content-widget--valid";
      if (!this.input_is_valid) return "div__input-controls-content-widget--invalid";
    },
  },
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
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__input-content-label {
  pointer-events: all;
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
/* Over ride the bootstrap default color for  valid (tick) alert from #28a745 to the one matching the mockflow value #19ac8a */
.form-control.is-valid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2319ac8a' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
}
/* Over ride the bootstrap default color for  valid (stop exclamatory) alert from #dc3545 to the one matching the mockflow value #bd3532 */
.form-control.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23bd3532' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23bd3532' stroke='none'/%3e%3c/svg%3e");
}
</style>
