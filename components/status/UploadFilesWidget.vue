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
      width="25"
      height="25"
      style="
        -webkit-transform: translateZ(0);
        position: absolute;
        width: 25px;
        height: 25px;
        top: 5px;
        left: 33px;
        color: #00c46f;
        z-index: 10;
      "
    >
      <!-- <FontAwesomeIcon :icon="['fa', 'check']" :style="{ 'color': 'rgb(0, 196, 111);' }" /> -->
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fa"
        data-icon="check"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="svg-inline--fa fa-check fa-w-16"
      >
        <path
          fill="#00c46f"
          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          class=""
        ></path>
      </svg>
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
      style="
        position: absolute;
        width: 110px;
        height: 4px;
        top: 20px;
        left: 281px;
        visibility: visible;
        color: #111111;
        z-index: 7;
      "
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
      value: 500,
      max: 900,
    };
  },
  computed: {},
  methods: {},
};
</script>
<style>
.bg-success {
  background-color: #00c46f;
}
</style>
