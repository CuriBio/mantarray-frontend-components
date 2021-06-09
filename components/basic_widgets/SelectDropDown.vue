<template>
  <div
    class="div__input-dropdown-background"
    :style="'width: ' + input_width_background + 'px;' + 'height: ' + input_height_background + 'px;'"
  >
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
      :style="'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;'"
    >
      <span
        class="span__input-dropdown-controls-content-input-txt-widget"
        :style="'width: ' + input_width + 'px;'"
      >
        <select
          class="w-100 h-100 edit-id"
          style="background-color: #1c1c1c; border: 0px; cursor: pointer; color: #b7b7b7"
          @change="changeSelection($event.target.options.selectedIndex)"
        >
          <option v-for="(item, idx) in dropdown_options" :id="idx" :key="idx" :value="item">
            {{ item.name }}
          </option>
        </select>
      </span>
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

export default {
  name: "SelectDropDown",
  props: {
    title_label: { type: String, default: "" }, // title_text (str) (optional, defaults to empty string "")
    value: { type: String, default: "" }, // field_value (str) (optional, defaults to empty string "")
    options_text: { type: Array, required: true },
    input_width: { type: Number, default: 210 },
    options_id: { type: String, default: "" }, // This prop is utilized by the parent component
  },
  data() {
    return {
      input_dropdown_value_key: this.value,
      input_width_background: this.input_width + 4,
    };
  },
  computed: {
    dropdown_options: function () {
      const list = []; // list is empty to start

      for (let i = 0; i < this.options_text.length; i++) {
        // the options_text is required true so a minimal of one element is needed
        // if suppose options_text.length is zero(0) then return doesn't change its []
        let name;
        typeof this.options_text[i] === "string"
          ? (name = {
              id: this.options_id + i,
              name: this.options_text[i],
            })
          : (name = {
              id: this.options_id + i,
              name: this.options_text[i].letter + " " + this.options_text[i].label,
            });
        list.push(name);
      }
      return list;
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
  watch: {
    input_dropdown_value_key: function () {
      // This is a very sensitive computed function as its invoked on every key entry by user action
      // the function would never have any processing its only responsible to pass the value of string to the parent component
      // any modification to add logic might impact depedent functionalities, request to consult Eli or Raghu
      this.$emit("update:value", this.input_dropdown_value_key);
    },
    value: function () {
      this.input_dropdown_value_key = this.value;
    },
  },
  methods: {
    changeSelection(idx) {
      this.$emit("selection-changed", idx);
    },
  },
};
</script>
<style type="text/css">
.div__input-dropdown-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
}

.span__input-dropdown-content-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  height: 30px;
  top: 0px;
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
  z-index: 25;
  cursor: pointer;
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
  padding: 10px;
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
}
</style>
