<template>
  <div>
    <!-- original mockflow ID: cmpDaf090556edcfaef1fa3dae32a48c3cd8 -->
    <div class="div__upload-file-background"></div>
    <!-- original mockflow ID: cmpD1f8ff61b9f5d62ff426ef1e5e186f1ab_cvs -->
    <div v-show="tick" class="div__upload-custom-check-mark">
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fa"
        data-icon="check"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="svg-inline--fa-check"
      >
        <path
          fill="#00c46f"
          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          class="svg-inline-fa-check-path"
        ></path>
      </svg>
    </div>
    <!--  original mockflow ID: cmpD2eba17f4bc0b8222a44b2a8fffec29f8 -->
    <span class="span__upload-file-label-txt"> Successfully&nbsp;<wbr />Uploaded: </span>
    <!-- original mockflow ID: cmpD58c69d7de8aa0934dca9ef4e8beabbdc -->
    <span class="span__upload-file-count-container"> {{ value }}/{{ max }} </span>
    <b-progress id="upload-progress-bar" :value="value" :max="max" variant="success"></b-progress>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { BProgress } from "bootstrap-vue";
Vue.component("BProgress", BProgress);

export default {
  name: "UploadFilesWidget",
  data() {
    return {
      tick: false,
    };
  },
  computed: {
    ...mapState("settings", {
      value: "file_count",
    }),
    ...mapState("settings", {
      max: "max_file_count",
    }),
  },
  watch: {
    value() {
      if (this.value != 0) {
        if (this.max == this.value) {
          this.tick = true;
          setTimeout(
            function () {
              this.tick = false;
            }.bind(this),
            1500
          );
        } else {
          this.tick = false;
        }
      }
    },
  },
};
</script>
<style>
.div__upload-file-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: #111111;
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
}

.div__upload-custom-check-mark {
  position: absolute;
  width: 25px;
  height: 25px;
  top: 5px;
  left: 33px;
  color: #00c46f;
  z-index: 10;
}

.span__upload-file-label-txt {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 170px;
  height: 30px;
  top: 9px;
  left: 50.3571px;
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
}

.span__upload-file-count-container {
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
  font-family: "Anonymous Pro";
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: #b7b7b7;
  text-align: right;
  z-index: 9;
}

.progress {
  background-color: #4c4c4c;
}

#upload-progress-bar {
  position: absolute;
  width: 110px;
  height: 4px;
  top: 20px;
  left: 281px;
  visibility: visible;
  background-color: #4c4c4c;
  z-index: 7;
}
/* Raghu (12/22/20): As the Bootstrap contains the below mentioned CSS property:-
file path : /mantarray-frontend-components/node_modules/bootstrap/dist/css/bootstrap.css
.bg-success {
  background-color: #28a745 !important;
}

The MockFlowUI provides a different color code and the only way to override is to have !important
We override the background-color:#00c46f !important */

#upload-progress-bar > .bg-success {
  background-color: #00c46f !important;
}
</style>
