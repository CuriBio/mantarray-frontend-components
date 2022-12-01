<template>
  <div class="div__plate-barcode">
    <span class="span__plate-barcode-text" :style="dynamic_label_style"
      >{{ barcode_label }}:<!-- original MockFlow ID: cmpDb2bac556f7cfa22b31a3731d355864c9 --></span
    >
    <input
      id="plateinfo"
      :disabled="is_disabled"
      type="text"
      spellcheck="false"
      class="input__plate-barcode-entry"
      :style="dynamic_entry_style"
      :class="[
        barcode_info.valid ? `input__plate-barcode-entry-valid` : `input__plate-barcode-entry-invalid`,
      ]"
      :value="barcode_info.value"
      @input="set_barcode_manually"
    />
    <div
      v-if="barcode_manual_mode && active_processes"
      v-b-popover.hover.top="tooltip_text"
      :title="barcode_label"
      class="div__disabled-input-popover"
    />
    <div
      v-show="!barcode_manual_mode"
      v-b-popover.hover.top="tooltip_text"
      :title="barcode_label"
      class="input__plate-barcode-manual-entry-enable"
    >
      <span class="input__plate-barcode-manual-entry-enable-icon">
        <div id="edit-plate-barcode" @click="active_processes || $bvModal.show('edit-plate-barcode-modal')">
          <FontAwesomeIcon :icon="['fa', 'pencil-alt']" />
        </div>
      </span>
    </div>
    <b-modal id="edit-plate-barcode-modal" size="sm" hide-footer hide-header hide-header-close>
      <StatusWarningWidget
        :modal_labels="barcode_manual_labels"
        @handle_confirmation="handle_manual_mode_choice"
      />
    </b-modal>
    <b-modal id="barcode-warning" size="sm" hide-footer hide-header hide-header-close>
      <StatusWarningWidget
        :modal_labels="barcode_warning_labels"
        @handle_confirmation="close_warning_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import Vue from "vue";
import { VBPopover } from "bootstrap-vue";
Vue.directive("b-popover", VBPopover);

library.add(faPencilAlt);
/**
 * @vue-data {String} playback_state_enums - Current state of playback
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-event {String} set_barcode_manually - User entered String parser
 */
export default {
  name: "BarcodeViewer",
  components: {
    FontAwesomeIcon,
    StatusWarningWidget,
  },
  props: {
    barcode_type: { type: String, default: "plate_barcode" },
  },
  data() {
    return {
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES,
      barcode_manual_labels: {
        header: "Warning!",
        msg_one: "Do you want to enable manual barcode editing?",
        msg_two:
          "Once enabled, all barcodes must be entered manually. This should only be done if the barcode scanner is malfunctioning. Scanning cannot be re-enabled until software is restarted.",
        button_names: ["Cancel", "Yes"],
      },
      barcode_warning_labels: {
        header: "Warning!",
        msg_one: "A new barcode has been detected while a process was active.",
        msg_two: "All processes have been stopped.",
        button_names: ["Okay"],
      },
    };
  },
  computed: {
    ...mapState("playback", ["playback_state", "barcodes", "barcode_warning"]),
    ...mapState("flask", ["barcode_manual_mode"]),
    barcode_info: function () {
      return this.barcodes[this.barcode_type];
    },
    barcode_label: function () {
      return this.barcode_type == "plate_barcode" ? "Plate Barcode" : "Stim Lid Barcode";
    },
    dynamic_label_style: function () {
      return this.barcode_type == "plate_barcode" ? "left: 17px;" : "left: 0px;";
    },
    dynamic_entry_style: function () {
      return this.barcode_type == "plate_barcode" ? "width: 110px;" : "width: 105px;";
    },
    tooltip_text: function () {
      return this.active_processes ? "Cannot edit barcodes while live view is active." : "Click to edit";
    },
    active_processes: function () {
      return (
        this.playback_state === this.playback_state_enums.RECORDING ||
        this.playback_state === this.playback_state_enums.BUFFERING ||
        this.playback_state === this.playback_state_enums.LIVE_VIEW_ACTIVE
      );
    },
    is_disabled: function () {
      return this.active_processes || !this.barcode_manual_mode;
    },
  },
  watch: {
    barcode_warning: function () {
      if (this.barcode_warning) this.$bvModal.show("barcode-warning");
    },
  },
  methods: {
    handle_manual_mode_choice(choice) {
      const bool_choice = Boolean(choice);
      this.$bvModal.hide("edit-plate-barcode-modal");
      this.$store.commit("flask/set_barcode_manual_mode", bool_choice);
      if (bool_choice) {
        console.log("Barcode Set Manually"); // allow-log
      }
    },
    set_barcode_manually: function (event) {
      this.$store.dispatch("playback/validate_barcode", {
        type: this.barcode_type,
        new_value: event.target.value,
      });
    },
    close_warning_modal() {
      this.$bvModal.hide("barcode-warning");
      this.$store.commit("playback/set_barcode_warning", false);
    },
  },
};
</script>
<style>
.div__plate-barcode *,
.div__plate-barcode *:before,
.div__plate-barcode *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__plate-barcode {
  position: relative;
  top: 0px;
  left: 0px;
  width: 287px;
  height: 34px;
  background: #1c1c1c;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.span__plate-barcode-text {
  pointer-events: all;
  line-height: 100%;
  overflow: hidden;
  position: absolute;
  width: 278px;
  height: 23px;
  top: 2px;
  padding: 5px;
  user-select: none;
  font-family: "Muli";
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(255, 255, 255);
  text-align: left;
}

.input__plate-barcode-entry *,
.input__plate-barcode-entry *:before,
.input__plate-barcode-entry *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.input__plate-barcode-entry {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  line-height: 24px;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  background-color: #000000;
  color: #b7b7b7;
  font-family: Anonymous Pro;
  font-weight: normal;
  box-shadow: none;
  border: none;
  position: absolute;
  height: 24px;
  top: 3px;
  right: 27px;
}

.div__disabled-input-popover {
  position: absolute;
  height: 24px;
  width: 100px;
  top: 3px;
  right: 27px;
}

.input__plate-barcode-entry-invalid {
  border: 1px solid red;
}

.input__plate-barcode-entry-valid {
  border: 1px solid green;
}
input:focus {
  outline: none;
}

.input__plate-barcode-manual-entry-enable {
  pointer-events: all;
  position: absolute;
  width: 34px;
  height: 34px;
  top: 0px;
  left: 263px;
}

.input__plate-barcode-manual-entry-enable-icon {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 24px;
  height: 24px;
  line-height: 24px;
  top: 5px;
  left: 0px;
  font-size: 14px;
  color: #b7b7b7;
}

.fa-pencil-alt:hover {
  color: #ececed;
}

.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

/* Center the edit-plate-barcode-modal pop-up dialog within the viewport */
#edit-plate-barcode-modal {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
