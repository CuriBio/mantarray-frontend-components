<template>
  <!-- <StatusWarningWidget :email_error="true" :modal_labels="short_circuit_labels" /> -->
  <!-- <StatusWarningWidget id="upload-modal" :modal_labels="sw_update_labels" /> -->
  <StatusWarningWidget id="upload-modal" :modal_labels="barcode_manual_labels" />
</template>
<script>
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
// import { StatusWarningWidget } from "@/dist/mantarray.common";

export default {
  components: {
    StatusWarningWidget,
  },
  data() {
    return {
      root_downloads_path: "C:\\Users\\username\\Downloads",
      last_file_name: "test-filename",
      short_circuit_labels: {
        header: "Error!",
        msg_one: "A short circuit error has been found during the configuration check.",
        msg_two: "Please replace stimulation lid and notify ",
        button_names: ["Okay"],
      },
      success_labels: {
        header: "Successful Upload!",
        msg_one: `The following recording was successfully uploaded: ${this.last_file_name}.`,
        msg_two: `C:\\Users\\username\\Downloads\\${this.last_file_name}.xlsx`,
        button_names: ["Close"],
      },
      failed_labels: {
        header: "Error!",
        msg_one: `There was an error uploading recording: ${this.last_file_name}.`,
        msg_two: "Will automatically retry next start up.",
        button_names: ["Close"],
      },
      fw_closure_warning_labels: {
        header: "Warning!",
        msg_one:
          "A firmware update for the Mantarray instrument is in progress. Closing the software now could damage the instrument.",
        msg_two: "Are you sure you want to exit?",
        button_names: ["Cancel", "Yes"],
      },
      sw_update_labels: {
        header: "Important!",
        msg_one: "A software update will be installed after exiting.",
        msg_two: "Please wait a few minutes before starting the software again.",
        button_names: ["Okay"],
      },
      calibration_modal_labels: {
        header: "Warning!",
        msg_one: "Please ensure no plate is present on device.",
        msg_two: "Do you wish to continue?",
        button_names: ["Cancel", "Yes"],
      },
      barcode_manual_labels: {
        header: "Warning!",
        msg_one: "Do you want to enable manual barcode editing?",
        msg_two:
          "Once enabled, all barcodes must be entered manually. This should only be done if the barcode scanner is malfunctioning. Scanning cannot be re-enabled until software is restarted.",
        button_names: ["Cancel", "Yes"],
      },
    };
  },
};
</script>
