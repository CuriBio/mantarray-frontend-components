<template>
  <div>
    <div class="div__status-spinner-background" :style="modal_height">
      <span class="span__status-spinner-label">{{ modal_labels.header }}</span>
      <div class="span__status-spinner-message" :style="message_height">
        <p>{{ modal_labels.msg_one }}</p>
        <p>{{ modal_labels.msg_two }}</p>
      </div>
      <span class="span__status-spinner" :style="spinner_top">
        <FontAwesomeIcon :icon="['fa', 'spinner']" pulse />
      </span>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSpinner as fa_spinner } from "@fortawesome/free-solid-svg-icons";

library.add(fa_spinner);

export default {
  name: "StatusSpinnerWidget",
  components: { FontAwesomeIcon },
  props: {
    modal_labels: {
      type: Object,
      default() {
        return {
          header: "Important!",
          msg_one: "The firmware update is in progress. It will take about 7 minutes to complete.",
          msg_two: "Do not close the Mantarray software or power off the Mantarray instrument.",
        };
      },
    },
  },
  computed: {
    compute_number_of_rows: function () {
      return (
        Math.ceil(((this.modal_labels.msg_one.length * 1.0) / 40 + 1).toFixed(1)) +
        Math.ceil(((this.modal_labels.msg_two.length * 1.0) / 40 + 1).toFixed(1))
      );
    },
    modal_height: function () {
      return `height: ${200 + this.compute_number_of_rows * 12}px;`;
    },
    message_height: function () {
      return `height: ${60 + this.compute_number_of_rows * 12}px;`;
    },
    spinner_top: function () {
      return `top: ${110 + this.compute_number_of_rows * 12}px;`;
    },
  },
};
</script>
<style scoped>
.div__status-spinner-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 420px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}
.span__status-spinner-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 420px;
  height: 30px;
  top: 22.385px;
  left: 0px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.span__status-spinner-message {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 55px;
  left: 21px;
  width: 378px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}
.span__status-spinner {
  left: 177px;
  position: absolute;
}
.fa-pulse {
  font-size: 4em;
  color: grey;
}
</style>
