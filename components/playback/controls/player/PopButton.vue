<template>
  <div>
    <b-button variant="dark">
      <span class="span__popbutton-controls-btn" @click="selected()"
        >Cancel</span
      ></b-button
    >
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
    title: { type: String, default: "" },
    focus_color: { type: String, default: "" },
    hide_color: { type: String, default: "" },
    hover_color: { type: String, default: "" },
    btn_width: { type: Number, default: 166.66 },
    btn_height: { type: Number, default: 30 },
    btn_top: { type: Number, default: 0 },
    btn_left: { type: Number, default: 0 },
  },
  data() {},
  computed() {},
  methods: {
    selected() {},
  },
};
</script>
<style>
.span__popbutton-controls-btn {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: "{{ btn_width }}px";
  height: "{{ btn_height }}px";
  top: "{{ btn_top }}px";
  left: "{{ btn_left }}px";
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
  z-index: 25;
}
</style>
