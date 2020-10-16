<template>
  <div>
    <div class="div__popbutton-background" :style="background_cssprops"></div>
    <span
      v-for="btn_index in num_of_btn"
      :key="btn_index"
      :ref="btn_index"
      :class="'span__popdialog-btn-' + btn_index"
      :style="btn_stateprop"
      @click="selected(btn_index)"
      @mouseenter="hover_active(btn_index)"
      @mouseleave="hover_inactive(btn_index)"
      >{{ popup_btn_names[btn_index - 1] }}</span
    >
    <!--    <span
      ref="btn_1"
      class="span__popdialog-btn-1"
      :style="btn_stateprop"
      @click="selected(1)"
      @mouseenter="hover_active(1)"
      @mouseleave="hover_inactive(1)"
      >{{ popup_btn_names[1] }}</span
    >
    <span
      ref="btn_2"
      class="span__popdialog-btn-2"
      :style="btn_stateprop"
      @click="selected(2)"
      @mouseenter="hover_active(2)"
      @mouseleave="hover_inactive(2)"
      >{{ popup_btn_names[2] }}</span
    >  -->
    <!--
    <canvas
      class="canvas__popdialog-form-controls-common-vertical-line"
      width="14"
      height="67"
    ></canvas>
    <canvas
      class="canvas__popdialog-form-controls-common-horizontal-line"
      :class="canvas__popdialog_form_controls_common_horizontal_line_dynamic"
      width="482"
      height="14"
    >
    </canvas>  -->
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "Popbutton",
  props: {
    popup_btn_names: {
      type: Array,
      default: function () {
        return [];
      },
    },
    focus_color: { type: String, default: "" },
    hide_color: { type: String, default: "" },
    hover_color: {
      type: Array,
      default: function () {
        return [];
      },
    },
    is_enabled: {
      type: Array,
      default: function () {
        return [];
      },
    },
    btn_width: { type: Number, default: 0 },
    btn_height: { type: Number, default: 0 },
    btn_top: { type: Number, default: 0 },
    btn_left: { type: Number, default: 0 },
    event_names: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      // num_of_btn: this.popup_btn_names.length,
      count: 0,
    };
  },
  computed: {
    num_of_btn: function () {
      return this.popup_btn_names.length;
    },
    background_cssprops: function () {
      return (
        "width: " +
        this.btn_width +
        "px; height: " +
        this.btn_height +
        "px; top: " +
        this.btn_top +
        "px; left: " +
        this.btn_left +
        "px;"
      );
    },
    btn_stateprop: function () {
      return this.is_enabled[this.count]
        ? "color: " + this.focus_color + ";"
        : "color: " + this.hide_color + ";";
    },
  },
  methods: {
    selected() {},
    hover_active(value) {
      if (this.is_enabled[value - 1] == true) {
        // this.$refs["btn_" + value].style.color = this.hover_color[value - 1];
        // const $ref = this.$refs + "value.toString()";
        // console.log($ref.style.color);
      }
    },
    hover_inactive(value) {
      if (this.is_enabled[value - 1] == true) {
        // this.$refs["btn_" + value].style.color = this.focus_color;
      }
    },
  },
};
</script>
<style>
.div__popbutton-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__popdialog-btn-1 {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 7px;
  left: 0px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #3f3f3f;
  text-align: center;
  z-index: 19;
}

.span__popdialog-btn-2 {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 7px;
  left: 166.66px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #3f3f3f;
  text-align: center;
  z-index: 3;
}

.span__popdialog-btn-3 {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 166.66px;
  height: 30px;
  top: 7px;
  left: 333.34px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #3f3f3f;
  text-align: center;
  z-index: 3;
}

/*.span__popdialog-btn-enable {*/
/*  color: #FFFFFF;*/
/*}*/

/*.span__popdialog-btn-disable {*/
/*  color: #3F3F3F;*/
/*}*/

/*.span__popdialog-form-controls-save-btn {*/
/*  pointer-events: all;*/
/*  line-height: 100%;*/
/*  transform: rotate(0deg);*/
/*  overflow: hidden;*/
/*  position: absolute;*/
/*  width: 250px;*/
/*  height: 30px;*/
/*  top: 7px;*/
/*  left: 250px;*/
/*  padding: 5px;*/
/*  visibility: visible;*/
/*  user-select: none;*/
/*  font-family: Muli;*/
/*  font-weight: normal;*/
/*  font-style: normal;*/
/*  text-decoration: none;*/
/*  font-size: 17px;*/
/*  text-align: center;*/
/*  z-index: 3;*/
/*}*/

/*.span__popdialog-form-controls-save-btn-enable {*/
/*  color: rgb(255, 255, 255);*/
/*}*/
/*.span__popdialog-form-controls-save-btn-enable:hover {*/
/*  color: #19ac8a;*/
/*}*/
/*.span__popdialog-form-controls-save-btn-disable {*/
/*  color: rgb(63, 63, 63);*/
/*}*/

/*.canvas__popdialog-form-controls-common-vertical-line {*/
/*  transform: rotate(0deg);*/
/*  pointer-events: all;*/
/*  position: absolute;*/
/*  width: 2px;*/
/*  height: 50px;*/
/*  top: 0px;*/
/*  left: 250px;*/
/*  visibility: visible;*/
/*  z-index: 15;*/
/*  background-color: #3f3f3f;*/
/*}*/

/*.canvas__popdialog-form-controls-common-horizontal-line {*/
/*  transform: rotate(0deg);*/
/*  pointer-events: all;*/
/*  position: absolute;*/
/*  width: 490px;*/
/*  height: 2px;*/
/*  top: 0px;*/
/*  left: 5px;*/
/*  visibility: visible;*/
/*  z-index: 13;*/
/*  background-color: #3f3f3f;*/
/*}*/
/*.canvas__popdialog-form-controls-common-horizontal-line-customer-account-id {*/
/*  top: 1px;*/
/*}*/
</style>
