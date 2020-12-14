<template>
  <div>
    <div
      id="cmpDaf090556edcfaef1fa3dae32a48c3cd8"
      class="mfWFCompCls"
      style="
        transform: rotate(0deg);
        box-sizing: border-box;
        padding: 0px;
        margin: 0px;
        background: rgb(17, 17, 17);
        position: absolute;
        width: 400px;
        height: 45px;
        top: 0px;
        left: 0px;
        visibility: visible;
        border: 0px none rgb(0, 0, 0);
        border-radius: 0px;
        box-shadow: none;
        z-index: 1;
        pointer-events: all;
      "
    ></div>
    <span
      id="cmpD2eba17f4bc0b8222a44b2a8fffec29f8"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 170px;
        height: 30px;
        top: 9px;
        left: 61.3571px;
        padding: 5px;
        visibility: visible;
        user-select: none;
        font-family: Muli;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        font-size: 15px;
        color: rgb(255, 255, 255);
        text-align: right;
        z-index: 3;
      "
    >
      Successfully&nbsp;<wbr />Uploaded:
    </span>
    <span
      id="cmpD58c69d7de8aa0934dca9ef4e8beabbdc"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 84px;
        height: 30px;
        top: 9.6663px;
        left: 200.909px;
        padding: 5px;
        visibility: visible;
        user-select: none;
        font-family: 'Anonymous Pro';
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        font-size: 15px;
        color: rgb(183, 183, 183);
        text-align: right;
        z-index: 9;
      "
    >
      24/900
    </span>
    <b-progress
      :value="value"
      :max="max"
      class="w-25 mb-2"
      style="z-index: 9"
    ></b-progress>
  </div>
</template>
<script>
import Vue from "vue";
import { BProgress } from "bootstrap-vue";
Vue.component("BProgress", BProgress);

export default {
  name: "UploadFilesWidget",
  data() {
    return {
      value: 10.000001,
      max: 50,
    };
  },
  computed: {},
  methods: {},
};
</script>
<style></style>
