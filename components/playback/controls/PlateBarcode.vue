<template>
  <div class="div__plate-barcode">
    <span class="span__plate-barcode-text"
      >Plate Barcode:<!-- original MockFlow ID: cmpDb2bac556f7cfa22b31a3731d355864c9 --></span
    >
    <!-- original Mockflow ID: cmpDd0be63536ca605546f566539e51ad0c3-->
    <input
      id="plateinfo"
      disabled="disabled"
      type="text"
      spellcheck="false"
      class="input__plate-barcode-entry"
      :class="[
        is_valid_barcode
          ? `input__plate-barcode-entry-valid`
          : `input__plate-barcode-entry-invalid`,
      ]"
      :value="barcode"
    />
    <!--</div>-->
  </div>
</template>
<script>
import { mapState } from "vuex";
/**
 * @vue-data {String} platebarcode - Current plate bar code
 * @vue-data {String} playback_state_enums - Current state of playback
 * @vue-computed {String} playback_state - Current value in Vuex store
 * @vue-event {String} validatePlateBarcode - User entered String parser
 */
export default {
  name: "PlateBarcode",
  computed: {
    ...mapState("playback", {
      playback_state: "playback_state",
    }),
    ...mapState("playback", {
      barcode: "barcode",
    }),
    ...mapState("playback", {
      is_valid_barcode: "is_valid_barcode",
    }),
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
</style>
