<template>
  <div class="div__input-dropdown-background" :style="dynamic_container_styles">
    <span
      v-if="title_label !== ''"
      class="span__input-dropdown-content-label"
      :style="'width: ' + input_width + 'px;'"
    >
      {{ title_label }}
      <!--  original mockflow ID: cmpDb072c1da7a823374cbee04cb1666edb1   -->
    </span>

    <div
      class="div__input-dropdown-controls-content-widget"
      :class="[
        invalid_text !== ''
          ? 'div__input-dropdown-controls-content-widget--invalid'
          : 'div__input-dropdown-controls-content-widget--valid',
      ]"
      :style="'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;'"
    >
      <span
        class="span__input-dropdown-controls-content-input-txt-widget"
        :style="'width: ' + input_width + 'px;'"
      >
        <b-form-input
          :id="'input-dropdown-widget-' + options_id"
          v-model="input_dropdown_value_key"
          :list="'option_list' + options_id"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-100 h-100 edit-id"
          :style="`border-radius: 0; background-color: ${input_background_color}; border: 0px; color: #ffffff`"
        />
        <datalist v-if="dropdown_options.length" :id="'option_list' + options_id">
          <option v-for="item in dropdown_options" :id="item.id" :key="item.id">
            {{ item.name }}
          </option>
        </datalist>
      </span>
    </div>
    <div
      v-show="invalid_text !== ''"
      :id="'input-dropdown-widget-feedback-' + options_id"
      class="div__input-dropdown-controls-content-feedback"
      :style="'width: ' + input_width + 'px;' + 'top:' + input_feedback_top + 'px;'"
    >
      {{ invalid_text }}
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BFormInput", BFormInput);

export default {
  name: "InputDropDown",
  props: {
    title_label: { type: String, default: "" }, // title_text (str) (optional, defaults to empty string "")
    placeholder: { type: String, default: "" }, // placeholder (str)
    invalid_text: { type: String, default: "" }, // invalid_text (str)
    value: { type: String, default: "" }, // field_value (str) (optional, defaults to empty string "")
    input_width: { type: Number, default: 0 }, // textbox_width (int)  [pixels]
    disabled: { type: Boolean, default: false }, // disabled (optional bool=False) (not able to type into input)
    options_text: { type: Array, required: true },
    options_id: { type: String, default: "" }, // This prop is utilized by the parent component
    input_background_color: { type: String, default: "#1c1c1c" },
    container_background_color: { type: String, default: "rgb(0, 0, 0)" },
  },
  data() {
    return {
      input_dropdown_value_key: this.value,
      input_width_background: this.input_width + 4,
    };
  },
  computed: {
    dropdown_options: function () {
      return this.options_text.map((val, i) => {
        return {
          id: this.options_id + i,
          name: val,
        };
      });
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
    dynamic_container_styles: function () {
      return (
        "width: " +
        this.input_width_background +
        "px;" +
        "height: " +
        this.input_height_background +
        "px; background: " +
        this.container_background_color +
        "; border: 2px solid " +
        this.container_background_color +
        ";"
      );
    },
  },
  watch: {
    input_dropdown_value_key: function () {
      this.$emit("update:value", this.input_dropdown_value_key);
    },
    value: function () {
      this.input_dropdown_value_key = this.value;
    },
  },
  methods: {},
};
</script>
<style scoped>
body {
  user-select: none;
}
.div__input-dropdown-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 0px;
  display: flex;
  left: 0px;
  visibility: visible;
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__input-dropdown-content-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  height: 30px;
  top: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #b7b7b7;
  z-index: 25;
  text-align: center;
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

.div__input-dropdown-controls-content-widget {
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

.div__input-dropdown-controls-content-widget--invalid {
  border-width: thin;
  border-style: solid;
  border-color: #bd3532;
}

.div__input-dropdown-controls-content-widget--valid {
  border-width: thin;
  border-style: solid;
  border-color: #19ac8a;
}

.div__input-dropdown-controls-content-feedback {
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
