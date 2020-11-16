<template>
  <div class="div__plate-barcode">
    <span class="span__plate-barcode-text"
      >Plate Barcode:<!-- original MockFlow ID: cmpDb2bac556f7cfa22b31a3731d355864c9 --></span
    >
    <!-- original Mockflow ID: cmpDd0be63536ca605546f566539e51ad0c3-->
    <input
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
      :value="platebarcode"
      @input="validatePlateBarcode"
    />
    <!--</div>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
import playback_module from "@/store/modules/playback";
import { TextValidation } from "@/js_utils/text_validation.js";
/**
 * @vue-data {String} platebarcode - Current plate bar code
 * @vue-data {String} playback_state_enums - Current state of playback
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-event {String} validatePlateBarcode - User entered String parser
 */
const TextValidation_plate_barcode = new TextValidation("platebarcode");
export default {
  name: "PlateBarcode",
  data() {
    return {
      platebarcode: "",
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES,
    };
  },
  computed: {
    ...mapState("playback", {
      playback_state: "playback_state",
    }),
  },
  updated() {
    this.platebarcode = this.$store.state.playback.barcode;
  },
  methods: {
    validatePlateBarcode(event) {
      const val = event.target.value;
      const inp = document.getElementById("plateinfo");

      inp.addEventListener("blur", this.set_red_color(inp));
      this.$store.commit("playback/set_barcode_number", null);
      const result = TextValidation_plate_barcode.validate(val);
      if (result == "") {
        this.set_green_color(inp);
        this.$store.commit("playback/set_barcode_number", val);
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
  width: 288px;
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

  background-color: black;

  color: #b7b7b7;
  font-family: Muli;
  font-weight: bold;
  box-shadow: none;
  border: none;
  position: absolute;

  width: 125px;
  height: 24px;
  top: 3px;
  right: 17px;

  border: 1px solid red;
}

input:focus {
  outline: none;
  border: 1px solid red;
}
</style>
