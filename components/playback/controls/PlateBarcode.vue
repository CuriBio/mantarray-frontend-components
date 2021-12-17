<template>
  <div class="div__plate-barcode">
    <span class="span__plate-barcode-text"
      >Plate Barcode:<!-- original MockFlow ID: cmpDb2bac556f7cfa22b31a3731d355864c9 --></span
    >
    <!-- original Mockflow ID: cmpDd0be63536ca605546f566539e51ad0c3-->
    <input
      v-if="manual"
      id="plateinfo"
      disabled="disabled"
      type="text"
      spellcheck="false"
      class="input__plate-barcode-entry"
      :class="[is_valid_barcode ? `input__plate-barcode-entry-valid` : `input__plate-barcode-entry-invalid`]"
      :value="barcode"
    />
    <input
      v-if="!manual"
      id="plateinfo"
      :disabled="
        playback_state === playback_state_enums.RECORDING ||
        playback_state === playback_state_enums.BUFFERING ||
        playback_state === playback_state_enums.LIVE_VIEW_ACTIVE
      "
      type="text"
      spellcheck="false"
      onpaste="return false;"
      class="input__plate-barcode-entry"
      :value="plate_barcode"
      @input="validatePlateBarcode"
    />
    <div v-show="manual" class="input__plate-barcode-manual-entry-enable">
      <span class="input__plate-barcode-manual-entry-enable-icon">
        <div id="edit-plate-barcode" v-b-modal.edit-plate-barcode-modal>
          <FontAwesomeIcon :icon="['fa', 'pencil-alt']" />
        </div>
      </span>
    </div>
    <!--</div>-->
    <b-modal id="edit-plate-barcode-modal" size="sm" hide-footer hide-header hide-header-close>
      <BarcodeEditDialog
        @cancel-plate-barcode="manual_mode_off"
        @yes-plate-barcode="manual_mode_on"
      ></BarcodeEditDialog>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { TextValidation } from "@/js_utils/text_validation.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BarcodeEditDialog from "@/components/status/BarcodeEditDialog.vue";

library.add(faPencilAlt);
const TextValidation_plate_barcode = new TextValidation("plate_barcode");
/**
 * @vue-data {String} plate_barcode - Current plate barcode
 * @vue-data {String} playback_state_enums - Current state of playback
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-event {String} validatePlateBarcode - User entered String parser
 */
export default {
  name: "PlateBarcode",
  components: {
    FontAwesomeIcon,
    BarcodeEditDialog,
  },
  data() {
    return {
      manual: true,
      plate_barcode: "",
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES,
    };
  },
  computed: {
    ...mapState("playback", ["playback_state", "barcode", "is_valid_barcode"]),
  },
  updated() {
    this.plate_barcode = this.$store.state.playback.barcode;
  },
  methods: {
    manual_mode_off: function () {
      this.$bvModal.hide("edit-plate-barcode-modal");
    },
    manual_mode_on: function () {
      this.manual = false;
      this.$bvModal.hide("edit-plate-barcode-modal");
      this.$store.commit("flask/set_barcode_manual_mode", true);
      this.$store.commit("playback/set_barcode_number_manual_mode", null);
    },
    validatePlateBarcode: function (event) {
      const val = event.target.value;
      const inp = document.getElementById("plateinfo");

      inp.addEventListener("blur", this.set_red_color(inp));
      this.$store.commit("playback/set_barcode_number_manual_mode", null);
      this.$store.commit("playback/set_barcode_valid_manual_mode", false);
      const result = TextValidation_plate_barcode.validate(val);
      if (result == "") {
        this.set_green_color(inp);
        this.$store.commit("playback/set_barcode_number_manual_mode", val);
        this.$store.commit("playback/set_barcode_valid_manual_mode", true);
      }
      if (result == " ") {
        this.set_red_color(inp);
      }
    },
    set_green_color(inp) {
      inp.style.border = "1px solid green";
    },
    set_red_color(inp) {
      inp.style.border = "1px solid red";
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
  position: absolute;
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
  left: 17px;
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

  width: 110px;
  height: 24px;
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
  border: 1px solid red;
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
/* Center the edit-plate-barcode-modal pop-up dialog within the viewport */
#edit-plate-barcode-modal {
  position: fixed;
  margin: 5% auto;
  top: 15%;
  left: 0;
  right: 0;
}
</style>
