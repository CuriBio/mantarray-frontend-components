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
    <span class="span__upload-file-count-container"> {{ file_count }}/{{ total_file_count }} </span>
    <b-progress id="upload-progress-bar" :value="file_count" :max="total_file_count" variant="success" />
    <b-modal id="upload-status" size="sm" hide-footer hide-header hide-header-close :static="true">
      <StatusWarningWidget
        id="upload-modal"
        :include_filepath="status"
        :modal_labels="modal_labels"
        @handle_confirmation="$bvModal.hide('upload-status')"
      />
    </b-modal>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import { BProgress, BModal } from "bootstrap-vue";
import BootstrapVue from "bootstrap-vue";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";

Vue.use(BootstrapVue);
Vue.component("BProgress", BProgress);
Vue.component("BModal", BModal);

export default {
  name: "UploadFilesWidget",
  components: {
    StatusWarningWidget,
  },
  data() {
    return {
      tick: false,
      modal_labels: {
        header: "",
        msg_one: "",
        msg_two: "",
        button_names: ["close"],
      },
      status: false,
    };
  },
  computed: {
    ...mapState("settings", [
      "file_count",
      "total_file_count",
      "upload_error",
      "total_uploaded_files",
      "root_downloads_path",
      "job_limit_reached",
    ]),
    last_file_name() {
      return this.total_uploaded_files[this.total_uploaded_files.length - 1];
    },
  },
  watch: {
    file_count: function () {
      if (this.file_count != 0) {
        if (this.total_file_count == this.file_count) {
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

      if (!this.upload_error) {
        this.status = true;
        this.modal_labels = {
          header: "Successful Upload!",
          msg_one: `The following recording was successfully uploaded and analyzed: ${this.last_file_name}. It has been downloaded here:`,
          msg_two: `${this.root_downloads_path}\\${this.last_file_name}.xlsx`,
          button_names: ["Close"],
        };
        this.$bvModal.show("upload-status");
      }
    },
    upload_error: function () {
      if (this.upload_error === "generic") {
        this.status = false;
        this.modal_labels = {
          header: "Error!",
          msg_one: `There was an error uploading recording: ${this.last_file_name}.`,
          msg_two: "Will automatically retry next start up.",
          button_names: ["Close"],
        };
      } else if (this.upload_error === "usage") {
        this.status = false;
        this.modal_labels = {
          header: "Important!",
          msg_one: `The following recording was successfully uploaded: ${this.last_file_name}. `,
          msg_two: `However, because the analysis limit has been reached for this customer account, the analysis will not run.`,
          button_names: ["Close"],
        };
        this.$store.commit("settings/set_job_limit_reached", true);
      }
      // reset
      this.$store.commit("settings/set_upload_error", false);
      this.$bvModal.show("upload-status");
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
  position: relative;
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
  font-size: 14px;
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
  width: 65px;
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
#upload-progress-bar > .bg-success {
  background-color: #00c46f !important;
}
.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

#upload-status {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
