<template>
  <div>
    <!--  original mockflow ID:  cmpDf4f7dd55b2e166cb0d0e843ee15b7aad -->
    <div class="div__heatmap-layout-background"></div>
    <!--  original mockflow ID:  cmpDc41b1cc426d26a92a64089e70f3d6d88 -->
    <div class="div__heatmap-layout-twitch-force-label">Twitch Force (μN)</div>
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
        :lower_range="lower"
        :upper_range="upper"
        :heatmap_height="height"
        :gradient_range="range"
        :units="unit"
      ></HeatMapColorBar>
    </div>
    <!-- original mockflow ID: cmpDceaaf3ae28ae1a3394f714f82cb8848d -->
    <div class="div__heatmap-layout-heatmap-settings-panel"></div>
    <span
      id="cmpD64bd4f78c20868d7dd5a9b4aa39bf217"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 300px;
        height: 34px;
        top: 62px;
        left: 1621px;
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
        z-index: 5;
      "
    >
      Heatmap&nbsp;<wbr />Settings
    </span>
    <canvas
      id="cmpD56369ad2e65893ae5ca594f14a64e378"
      class="mfWFCompCls"
      width="272"
      height="2"
      style="
        transform: rotate(0deg);
        pointer-events: all;
        position: absolute;
        width: 272px;
        height: 2px;
        top: 100px;
        left: 1634px;
        visibility: visible;
        z-index: 100;
        background-color: #3f3f3f;
        opacity: 0.5;
      "
    >
    </canvas>
    <span
      id="cmpD9c0a6e873d03a7f83e8a68941610e993"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 300px;
        height: 30px;
        top: 113.991px;
        left: 1621.1px;
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
        z-index: 3;
      "
    >
      Scale&nbsp;<wbr />Bar</span
    >
    <div
      id="cmpD5cceb38a3af00a6bd7589d883fa87688"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        transform: rotate(0deg);
        position: absolute;
        width: 50px;
        height: 50px;
        top: 152px;
        left: 1713px;
        visibility: visible;
        z-index: 118;
      "
    >
      <CheckBoxWidget :checkbox_options="option"></CheckBoxWidget>
    </div>
    <span
      id="cmpD8a25d29c92a6f84cc071bcf466ca36ce"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 86px;
        height: 20px;
        top: 152.991px;
        left: 1744.28px;
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
        z-index: 80;
      "
      >Auto&nbsp;<wbr />Scale</span
    >
    <span
      id="cmpDda68e4034616b4f5e244dc57e815c027"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 82px;
        height: 30px;
        top: 193.217px;
        left: 1675.86px;
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
        z-index: 82;
      "
      >Maximum</span
    >
    <div
      id="cmpDb88cb7785bf9ca45549b1866c2c20122"
      class="mfWFCompCls"
      width="121"
      height="52"
      style="
        pointer-events: all;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 121px;
        height: 52px;
        top: 180.925px;
        left: 1753.44px;
        visibility: visible;
        z-index: 84;
      "
    >
      <InputWidget
        :placeholder="'100'"
        :invalid_text="''"
        :input_width="105"
      ></InputWidget>
    </div>
    <span
      id="cmpDc06480c6344db8d23dca86a4c1e88ab4"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 83px;
        height: 30px;
        top: 245.217px;
        left: 1675.86px;
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
        z-index: 88;
      "
      >Minimum</span
    >
    <div
      id="cmpD1fda22cfac2b66c17a7f3def056669a0"
      class="mfWFCompCls"
      width="121"
      height="52"
      style="
        pointer-events: all;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 121px;
        height: 52px;
        top: 232.925px;
        left: 1753.44px;
        visibility: visible;
        z-index: 86;
      "
    >
      <InputWidget
        :placeholder="'0'"
        :invalid_text="''"
        :input_width="105"
      ></InputWidget>
    </div>
    <canvas
      id="cmpD8d0ef3020c7613af7ae63fa5722de759"
      class="mfWFCompCls"
      width="212"
      height="2"
      style="
        transform: rotate(0deg);
        pointer-events: all;
        position: absolute;
        width: 212px;
        height: 2px;
        top: 298px;
        left: 1664px;
        visibility: visible;
        z-index: 102;
        background-color: #3f3f3f;
        opacity: 0.5;
      "
    >
    </canvas>
    <span
      id="cmpD4146e3d532d7eb0719ee0d6e06485940"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 301px;
        height: 30px;
        top: 312.667px;
        left: 1621px;
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
        z-index: 96;
      "
      >Display</span
    >
    <div
      id="cmpDa1c3ce66a0c6d38c39ace76539269b2f"
      class="mfWFCompCls dropdowncomp"
      style="
        pointer-events: all;
        white-space: nowrap;
        line-height: 100%;
        transform: rotate(0deg);
        position: absolute;
        width: 210px;
        height: 50px;
        top: 347px;
        left: 1664px;
        padding: 5px;
        visibility: visible;
        z-index: 114;
      "
    >
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

    <canvas
      id="cmpDc08190eb24c68e02c278bde19882becb"
      class="mfWFCompCls"
      width="212"
      height="2"
      style="
        transform: rotate(0deg);
        pointer-events: all;
        position: absolute;
        width: 212px;
        height: 2px;
        top: 417px;
        left: 1664px;
        visibility: visible;
        z-index: 110;
        background-color: #3f3f3f;
        opacity: 0.5;
      "
    >
    </canvas>
    <span
      id="cmpD03029ea224291e6817f40d3ac9f24b19"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 301px;
        height: 30px;
        top: 426.667px;
        left: 1621px;
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
        z-index: 106;
      "
    >
      Color&nbsp;<wbr />Scheme</span
    >
    <div style="top: 458px; left: 1697.5px; position: absolute">
      <RadioButtonWidget :radio_buttons="button_names"></RadioButtonWidget>
    </div>
    <span
      id="cmpD5bc3214687200b065320c06b0a15e013"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 300px;
        height: 25px;
        top: 597.667px;
        left: 1621.36px;
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
        z-index: 98;
      "
      >QC&nbsp;<wbr />Options</span
    >
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
      option: [{ text: "", value: "Ascorbic Acid" }],
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
      upper: 100,
      unit: "μN",
      range: [
        { color: "#bd3532", offset: "0%" },
        { color: "#f9d78c", offset: "100%" },
      ],
    };
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
  methods: {},
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
  width: 1920px;
  height: 930px;
  top: 0px;
  left: 1px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 1;
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
  top: 146px;
  left: 288.364px;
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
  z-index: 112;
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
  top: 187px;
  left: 574.5px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  z-index: 9;
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
  top: 676px;
  left: 577.455px;
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
  z-index: 3;
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
  top: 676px;
  left: 740.455px;
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
  z-index: 5;
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
  top: 185.5px;
  left: 1301.5px;
  visibility: visible;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 90;
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
  top: 45px;
  left: 1620px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 1;
  pointer-events: all;
}

.div__checkbox-background {
  width: 0px;
  height: 0px;
}
</style>
