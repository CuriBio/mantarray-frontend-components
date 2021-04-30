<template>
  <div>
    <!--  original mockflow ID:  cmpDf4f7dd55b2e166cb0d0e843ee15b7aad -->
    <div class="div__heatmap-layout-background"></div>
    <!--  original mockflow ID:  cmpDc41b1cc426d26a92a64089e70f3d6d88 -->
    <div class="div__heatmap-layout-twitch-force-label">
      {{ heatmap_option_final }} (μN)
    </div>
    <!--  original mockflow ID:  cmpDeb75716be024c38385f1f940d7d0551d -->
    <div class="div__heatmap-layout-heatmap-editor-widget">
      <PlateHeatMap :platecolor="passing_plate_colors"></PlateHeatMap>
    </div>
    <!-- original mockflow ID:   cmpD9bf89cc77f1d867d1b3f93e925ee43ce -->
    <div class="div__heatmap-layout-heatmap-well-label">Well A01 (μN):</div>
    <!-- original mockflow ID:  cmpDde968837816d0d1051ada7bf835872f8 -->
    <div class="div__heatmap-layout-heatmap-well-value">0</div>
    <!-- original mockflow ID: cmpDb59694a85eb967571cf98a41b5fa7481 -->
    <div class="div__heatmap-layout-heatmap-colorbar-container">
      <HeatMapColorBar
        :gradient_uuid="provided_uuid"
        :lower_range="lower_final"
        :upper_range="upper_final"
        :heatmap_height="height"
        :gradient_range="range"
        :units="unit"
      ></HeatMapColorBar>
    </div>
    <!-- original mockflow ID: cmpDceaaf3ae28ae1a3394f714f82cb8848d -->
    <div class="div__heatmap-layout-heatmap-settings-panel"></div>
    <!-- original mockflow ID: cmpD64bd4f78c20868d7dd5a9b4aa39bf217 -->
    <span class="span__heatmap-layout-heatmap-settings-label">
      Heatmap&nbsp;<wbr />Settings
    </span>
    <!-- original mockflow ID: cmpD56369ad2e65893ae5ca594f14a64e378 -->
    <canvas
      class="canvas__heatmap-settings-title-seperator"
      width="272"
      height="2"
    >
    </canvas>
    <!-- original mockflow ID: cmpD9c0a6e873d03a7f83e8a68941610e993 -->
    <span class="span__heatmap-layout-heatmap-scale-label">
      Scale&nbsp;<wbr />Bar</span
    >
    <!-- original mockflow ID:  cmpD5cceb38a3af00a6bd7589d883fa87688 -->
    <div class="div__heatmap-layout-checkbox-container">
      <CheckBoxWidget
        :checkbox_options="option"
        @checkbox-selected="auto_scale"
      ></CheckBoxWidget>
    </div>
    <!-- original mockflow ID:  cmpD8a25d29c92a6f84cc071bcf466ca36ce -->
    <span class="span__heatmap-layout-checkbox-label"
      >Auto&nbsp;<wbr />Scale</span
    >
    <!-- original mockflow ID:  cmpDda68e4034616b4f5e244dc57e815c027 -->
    <span class="span__heatmap-layout-maximum-label">Maximum</span>
    <!-- original mockflow ID:  cmpDb88cb7785bf9ca45549b1866c2c20122 -->
    <div
      class="div__heatmap-layout-maximum-input-container"
      width="121"
      height="52"
    >
      <InputWidget
        :placeholder="'100'"
        :invalid_text="max_heatmap_value"
        :input_width="105"
        :dom_id_suffix="'max'"
        @update:value="on_update_maximum($event)"
      ></InputWidget>
    </div>
    <!-- original mockflow ID:  cmpDc06480c6344db8d23dca86a4c1e88ab4 -->
    <span class="span__heatmap-layout-minimum-input-container">Minimum</span>
    <!-- original mockflow ID:  cmpD1fda22cfac2b66c17a7f3def056669a0 -->
    <div
      class="div__heatmap-layout-minimum-input-container"
      width="121"
      height="52"
    >
      <InputWidget
        :placeholder="'0'"
        :invalid_text="min_heatmap_value"
        :input_width="105"
        :dom_id_suffix="'min'"
        :disabled="on_start"
        @update:value="on_update_minimum($event)"
      ></InputWidget>
    </div>
    <!-- original mockflow ID:  cmpD8d0ef3020c7613af7ae63fa5722de759  -->
    <canvas
      class="canvas__heatmap-settings-scale-seperator"
      width="212"
      height="2"
    >
    </canvas>
    <!-- original mockflow ID: cmpD4146e3d532d7eb0719ee0d6e06485940 -->
    <span class="span__heatmap-layout-display-label">Display</span>
    <!-- original mockflow ID: cmpDa1c3ce66a0c6d38c39ace76539269b2f  -->
    <div class="div__heatmap-layout-display-input-dropdown-container">
      <InputDropDown
        :title_label="label"
        :placeholder="keyplaceholder"
        :invalid_text="error_text"
        :value.sync="entrykey"
        :input_width="entry_width"
        :disabled="disallow_entry"
        :options_text="nicknames_list"
        :message_if_blank="on_empty_flag"
      ></InputDropDown>
    </div>
    <!-- original mockflow ID: cmpDc08190eb24c68e02c278bde19882becb -->
    <canvas
      class="canvas__heatmap-settings-color-scheme-seperator"
      width="212"
      height="2"
    >
    </canvas>
    <!-- original mockflow ID: cmpD03029ea224291e6817f40d3ac9f24b19 -->
    <span class="span__heatmap-settings-color-scheme-label">
      Color&nbsp;<wbr />Scheme</span
    >
    <div class="div__heatmap-radio-buttons-container">
      <RadioButtonWidget :radio_buttons="button_names"></RadioButtonWidget>
    </div>
    <!-- orginal mockflow ID: cmpD5bc3214687200b065320c06b0a15e013 -->
    <span class="span__heatmap-settings-qc-options-label"
      >QC&nbsp;<wbr />Options</span
    >
    <!-- orginal mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7 -->
    <div class="div__heatmap-settings-apply-btn-container">
      <!-- orginal mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7_cvs -->
      <canvas class="canvas__heatmap-settings-apply-btn-container"> </canvas>
      <!-- original mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7_txt -->
      <span class="span__heatmap-settings-apply-btn-label"> Apply </span>
    </div>
    <!-- original mockflow ID: cmpD2f909255bf15b8f4daa88ed03c6a8300 -->
    <div class="div__heatmap-settings-reset-btn-container">
      <!-- original mockflow ID: cmpD2f909255bf15b8f4daa88ed03c6a8300_cvs -->
      <canvas class="canvas__heatmap-settings-reset-btn-container"> </canvas>
      <!-- original mockflow ID : cmpD2f909255bf15b8f4daa88ed03c6a8300_txt -->
      <span class="span__heatmap-settings-reset-btn-label"> Reset </span>
    </div>
  </div>
</template>
<script>
import CheckBoxWidget from "@/components/basic_widgets/CheckBoxWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import InputDropDown from "@/components/basic_widgets/InputDropDown.vue";
import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";
import HeatMapColorBar from "@/components/status/HeatMapColorBar.vue";
import PlateHeatMap from "@/components/plate_based_widgets/mapeditor/PlateHeatMap.vue";

export default {
  name: "HeatMap",
  components: {
    PlateHeatMap,
    HeatMapColorBar,
    InputWidget,
    InputDropDown,
    CheckBoxWidget,
    RadioButtonWidget,
  },
  data() {
    return {
      button_names: ["Warm", "Cool", "Blue/Red", "Purple/Green"],
      option: [{ text: "", value: "Auto-Scale" }],
      label: "",
      entrykey: "",
      keyplaceholder: "Twitch Force",
      error_text: "An ID is required",
      entry_width: 201,
      disallow_entry: false,
      nicknames_list: [
        "Twitch Force",
        "Twitch Period",
        "Twitch Frequency",
        "Twitch Width 80",
        "Contraction Velocity",
        "Relaxation Velocity",
      ],
      on_empty_flag: true,
      provided_uuid: "0",
      height: 481,
      lower: 0,
      lower_final: 0,
      upper: 0,
      upper_final: 0,
      unit: "μN",
      range: [
        { color: "#bd3532", offset: "0%" },
        { color: "#f9d78c", offset: "100%" },
      ],
      heatmap_option: "",
      heatmap_option_final: "",
      max_heatmap_value: "invalid",
      min_heatmap_value: "invalid",
      on_start: true,
    };
  },
  watch: {
    entrykey: function () {
      if (this.entrykey != "") {
        this.error_text = "";
        this.on_empty_flag = false;
      } else {
        this.on_empty_flag = true;
        this.error_text = "An ID is required";
      }
      this.heatmap_option = this.entrykey;
    },
  },
  created: function () {
    const plate_colors = [
      "#F9D78C",
      "#DF6147",
      "#DF6147",
      "#F0A061",
      "#DF6147",
      "#BD3532",
      "#BD3532",
      "#F0A061",
      "#F0A061",
      "#BD3532",
      "#BD3532",
      "#F9D78C",
      "#F0A061",
      "#F0A061",
      "#DF6147",
      "#DF6147",
      "#F9D78C",
      "#DF6147",
      "#F0A061",
      "#F9D78C",
      "#F0A061",
      "#F0A061",
      "#F9D78C",
      "#DF6147",
    ];
    this.passing_plate_colors = plate_colors;
  },
  methods: {
    auto_scale: function (new_value) {
      if (new_value == "Auto-Scale") {
        this.max_heatmap_value = "";
        this.min_heatmap_value = "";
        this.heatmap_option = this.entrykey = this.nicknames_list[0];
      } else {
        this.max_heatmap_value = "invalid";
        this.min_heatmap_value = "invalid";
        this.heatmap_option = this.entrykey = "";
      }
    },
    on_update_maximum: function (new_value) {
      const max = parseInt(new_value);
      if (new_value == "") {
        this.upper = 0;
        this.max_heatmap_value = "invalid";
        this.on_start = true;
      } else {
        if (max < 0 || new_value == "-") {
          this.max_heatmap_value = "cannot be negative";
        } else {
          if (this.lower > max) {
            this.max_heatmap_value = "min greater than max";
            this.min_heatmap_value = "min greater than max";
          } else {
            if (max > 1000) {
              this.max_heatmap_value = "larger than 1000";
            } else {
              if (this.lower == max) {
                this.max_heatmap_value = "max is equal to min";
                this.min_heatmap_value = "min is equal to max";
              } else {
                this.upper = max;
                this.max_heatmap_value = "";
                this.on_start = false;
              }
            }
          }
        }
      }
    },
    on_update_minimum: function (new_value) {
      const min = parseInt(new_value);
      if (this.upper == 0) {
        this.max_heatmap_value = "invalid";
        this.min_heatmap_value = "invalid";
      } else {
        if (new_value == "") {
          this.lower = 0;
          this.min_heatmap_value = "invalid";
        } else {
          if (min < 0 || new_value == "-") {
            this.min_heatmap_value = "cannot be negative";
          } else {
            if (min > this.upper) {
              this.max_heatmap_value = "min greater than max";
              this.min_heatmap_value = "min greater than max";
            } else {
              if (this.upper == min) {
                this.max_heatmap_value = "max is equal to min";
                this.min_heatmap_value = "min is equal to max";
              } else {
                this.lower = min;
                this.min_heatmap_value = "";
                this.max_heatmap_value = "";
              }
            }
          }
        }
      }
    },
  },
};
</script>
<style>
.div__heatmap-layout-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 1630px;
  height: 885px;
  top: 0px;
  left: 1px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}

.div__heatmap-layout-twitch-force-label {
  line-height: 1;
  transform: rotate(0deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(255, 255, 255);
  font-family: Muli;
  position: absolute;
  top: 101px;
  left: 0px;
  width: 1331px;
  height: 35px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 21px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}
.div__heatmap-layout-heatmap-editor-widget {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 715px;
  height: 480px;
  top: 142px;
  left: 284.5px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-well-label {
  line-height: 1;
  transform: rotate(0deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 631px;
  left: 287.455px;
  width: 165px;
  height: 35px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: left;
  font-size: 23px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-well-value {
  line-height: 1;
  transform: rotate(0deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(255, 255, 255);
  font-family: Muli;
  position: absolute;
  top: 631px;
  left: 450.455px;
  width: 127px;
  height: 35px;
  overflow: hidden;
  visibility: visible;
  user-select: none;
  text-align: left;
  font-size: 23px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-colorbar-container {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: linear-gradient(rgb(189, 53, 50), rgb(249, 215, 140));
  position: absolute;
  width: 41px;
  height: 481px;
  top: 140.5px;
  left: 1011.5px;
  visibility: visible;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-settings-panel {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 300px;
  height: 885px;
  top: 0px;
  left: 1330px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}

.span__heatmap-layout-heatmap-settings-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 300px;
  height: 34px;
  top: 62px;
  left: 1331px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 20px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.canvas__heatmap-settings-title-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 272px;
  height: 2px;
  top: 100px;
  left: 1330px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.span__heatmap-layout-heatmap-scale-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 300px;
  height: 30px;
  top: 113.991px;
  left: 1330px;
  padding: 5px;
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

.div__heatmap-layout-checkbox-container {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 50px;
  height: 50px;
  top: 152px;
  left: 1423px;
  visibility: visible;
}

.span__heatmap-layout-checkbox-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 86px;
  height: 20px;
  top: 152.991px;
  left: 1444.28px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}

.span__heatmap-layout-maximum-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 82px;
  height: 30px;
  top: 189.217px;
  left: 1385.86px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: right;
}

.div__heatmap-layout-maximum-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 121px;
  height: 59px;
  top: 178.925px;
  left: 1473.44px;
  visibility: visible;
}

.span__heatmap-layout-minimum-input-container {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 83px;
  height: 30px;
  top: 249.217px;
  left: 1385.86px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: right;
}

.div__heatmap-layout-minimum-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 121px;
  height: 59px;
  top: 240.925px;
  left: 1473.44px;
  visibility: visible;
}

.canvas__heatmap-settings-scale-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 212px;
  height: 2px;
  top: 305px;
  left: 1374px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.span__heatmap-layout-display-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 301px;
  height: 30px;
  top: 312.667px;
  left: 1331px;
  padding: 5px;
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

.div__heatmap-layout-display-input-dropdown-container {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 210px;
  height: 50px;
  top: 347px;
  left: 1384px;
  padding: 5px;
  visibility: visible;
}

.canvas__heatmap-settings-color-scheme-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 212px;
  height: 2px;
  top: 417px;
  left: 1374px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.span__heatmap-settings-color-scheme-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 301px;
  height: 30px;
  top: 426.667px;
  left: 1331px;
  padding: 5px;
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

.div__heatmap-radio-buttons-container {
  top: 458px;
  left: 1407.5px;
  position: absolute;
}
.span__heatmap-settings-qc-options-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 300px;
  height: 25px;
  top: 597.667px;
  left: 1331.36px;
  padding: 5px;
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

.div__heatmap-settings-apply-btn-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 130px;
  height: 55px;
  top: 806px;
  left: 1341px;
  visibility: visible;
  z-index: 152;
}

.canvas__heatmap-settings-apply-btn-container {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 130px;
  height: 55px;
  top: 0px;
  left: 0px;
  background: #b7b7b7;
}

.span__heatmap-settings-apply-btn-label {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 120px;
  height: 45px;
  line-height: 47px;
  top: 5px;
  left: 5px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: #6e6f72;
}

.div__heatmap-settings-reset-btn-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 130px;
  height: 55px;
  top: 806px;
  left: 1490.08px;
  visibility: visible;
  z-index: 154;
}

.canvas__heatmap-settings-reset-btn-container {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 130px;
  height: 55px;
  top: 0px;
  left: 0px;
  background: #b7b7b7;
}

.span__heatmap-settings-reset-btn-label {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 120px;
  height: 45px;
  line-height: 47px;
  top: 5px;
  left: 5px;
  user-select: none;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: rgb(0, 0, 0);
}

.div__heatmap-layout-checkbox-container > .div__checkbox-background {
  width: 0px;
  height: 0px;
}

.div__heatmap-layout-display-input-dropdown-container
  > .div__input-dropdown-background {
  background: none;
  border: none;
}
</style>
