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
    <div
      id="cmpD1f8ff61b9f5d62ff426ef1e5e186f1ab_cvs"
      width="35"
      height="35"
      style="
        -webkit-transform: translateZ(0);
        position: absolute;
        width: 35px;
        height: 35px;
        top: 5px;
        left: 33px;
        color: #00c46f;
      "
    >
      <FontAwesomeIcon :icon="['fa', 'check']" />
    </div>
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
      variant="success"
      height="2px"
      style="
        position: absolute;
        width: 110px;
        height: 2px;
        top: 20px;
        left: 281px;
        visibility: visible;
        z-index: 7;
      "
    ></b-progress>
  </div>
</template>
<script>
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fa_check } from "@fortawesome/free-solid-svg-icons";
import { BProgress } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("BProgress", BProgress);

library.add(fa_check);

export default {
  name: "UploadFilesWidget",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      value: 500,
      max: 900,
    };
  },
  computed: {},
  methods: {},
};
</script>
<style>
.progressbar li,
.progressbar li:after {
  top: 20px;
  left: 100px;
  width: 500px;
  z-index: -1;
  position: relative;
}
</style>
