<template>
  <div>
    <div
      class="div__popdialog-form-controls"
      :class="div__popdialog_form_controls_dynamic"
    ></div>
    <span
      v-show="is_addcustomer"
      class="span__popdialog-form-controls-cancel-btn"
      @click="cancel_addcustomer()"
      >Cancel</span
    >
    <span
      v-show="is_addcustomer"
      class="span__popdialog-form-controls-save-btn"
      :class="[
        allinputvalid
          ? 'span__popdialog-form-controls-save-btn-enable'
          : 'span__popdialog-form-controls-save-btn-disable',
      ]"
      @click="save_newcustomer()"
      >Save&nbsp;<wbr />ID</span
    >
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
    </canvas>
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
    popup_btn_name: { type: String, default: "" },
    focus_color: { type: String, default: "" },
    hide_color: { type: String, default: "" },
    hover_color: { type: String, default: "" },
    btn_width: { type: Number, default: 0 },
    btn_height: { type: Number, default: 0 },
    btn_top: { type: Number, default: 0 },
    btn_left: { type: Number, default: 0 },
  },
  data() {
    return {
      is_addcustomer: true,
      allinputvalid: true,
    };
  },
  computed: {
    div__popdialog_form_controls_dynamic: function () {
      return "div__popdialog-form-controls-customer-account-id";
    },
    canvas__popdialog_form_controls_common_horizontal_line_dynamic: function () {
      return "canvas__popdialog-form-controls-common-horizontal-line-customer-account-id";
    },
  },
  methods: {
    selected() {},
  },
};
</script>
<style>
.div__popdialog-form-controls {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 500px;
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

.span__popdialog-form-controls-cancel-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
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
  color: rgb(255, 255, 255);
  text-align: center;
  z-index: 19;
}
.span__popdialog-form-controls-cancel-btn:hover {
  color: rgb(189 53 50);
}

.span__popdialog-form-controls-save-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 250px;
  height: 30px;
  top: 7px;
  left: 250px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  text-align: center;
  z-index: 3;
}

.span__popdialog-form-controls-save-btn-enable {
  color: rgb(255, 255, 255);
}
.span__popdialog-form-controls-save-btn-enable:hover {
  color: #19ac8a;
}
.span__popdialog-form-controls-save-btn-disable {
  color: rgb(63, 63, 63);
}

.canvas__popdialog-form-controls-common-vertical-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 50px;
  top: 0px;
  left: 250px;
  visibility: visible;
  z-index: 15;
  background-color: #3f3f3f;
}

.canvas__popdialog-form-controls-common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 490px;
  height: 2px;
  top: 0px;
  left: 5px;
  visibility: visible;
  z-index: 13;
  background-color: #3f3f3f;
}
.canvas__popdialog-form-controls-common-horizontal-line-customer-account-id {
  top: 1px;
}
</style>
