<template>
  <div>
    <!-- original mockflow ID:  id="cmpD0bdbd5699263f6535bd7dffbc49c09fb" -->
    <canvas
      class="canvas__y-axis-control-settings-background"
      width="295"
      height="350"
    >
    </canvas>
    <!-- original mockflow ID:  id="cmpDd424de000684523a198de85a85b9fba1" -->
    <span class="span__y-axis-control-settings-label"
      >Y-Axis&nbsp;<wbr />Display&nbsp;<wbr />Mode</span
    >
    <!-- original mockflow ID:  id="cmpD99791429192bc48b7499cdcba2cc72ea" -->
    <div class="div__y-axis-controls-settings-radio-buttons">
      <RadioButtonWidget :radio_buttons="button_names"></RadioButtonWidget>
    </div>
    <!-- original mockflow ID: id="cmpD0b403c0dbaf4c4a4549aee8d1fe4810d" -->
    <span class="span__y-axis-controls-settings-setup"
      >Set&nbsp;<wbr />Y-Axis&nbsp;<wbr />Values</span
    >
    <!-- original mockflow ID:  id="cmpDdb444fd5c7d0c3187e97bca0d24de0ee" -->
    <span class="span__y-axis-controls-settings-max-value">Maximum:</span>
    <!-- original mockflow ID:  id="cmpD6a9398a35a4e46ab44ef8d7d37256767" -->
    <div class="div__y-axis-controls-settings-input-container">
      <InputWidget
        :placeholder="'1000'"
        :invalid_text="'invalid'"
        :input_width="106"
      ></InputWidget>
    </div>
    <!-- original mockflow ID: id="cmpD549973a497f2bedf77cd8fd2d19b7948" -->
    <span class="span__y-axis-controls-settings-input-max-units">uV</span>
    <!-- original mockflow ID: id="cmpDfd4427b907fb9a6aeb301b47d0146569" -->
    <span class="span__y-axis-controls-settings-min-value">Minimum:</span>
    <!-- original mockflow ID: id="cmpD6a9398a35a4e46ab44ef8d7d37256767" -->
    <div class="div__y-axis-controls-settings-input-min-container">
      <InputWidget
        :placeholder="'0'"
        :invalid_text="'invalid'"
        :input_width="106"
      ></InputWidget>
    </div>
    <!-- original mockflow ID: id="cmpD549973a497f2bedf77cd8fd2d19b7948" -->
    <span class="span__y-axis-controls-settings-input-min-units">uV</span>
    <div style="top: 310px; left: 0px; position: absolute; z-index: 38">
      <ButtonWidget
        :button_widget_width="295"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_y_axis_widget"
        :enabled_color="visiblecolor_y_axis_widget"
        :disabled_color="hidecolor_y_axis_widget"
        :hover_color="hovercolors_y_axis_widget"
        :is_enabled="enablelist_y_axis_widget"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "YAxisControlsSettings",
  components: {
    RadioButtonWidget,
    InputWidget,
    ButtonWidget,
  },
  data() {
    return {
      button_names: ["Absolute", "Baseline Standard", "..."],
    };
  },
  created: function () {
    this.btnnames_y_axis_widget = ["Apply", "Cancel"];
    this.enablelist_y_axis_widget = [true, true];
    this.visiblecolor_y_axis_widget = "#B7B7B7";
    this.hidecolor_y_axis_widget = "#3F3F3F";
    this.hovercolors_y_axis_widget = ["#FFFFFF", "#FFFFFF"];
  },
  methods: {},
};
</script>
<style>
.canvas__y-axis-control-settings-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 295px;
  height: 350px;
  top: 0px;
  left: 0px;
  background-color: rgb(17, 17, 17);
  visibility: visible;
}
.span__y-axis-control-settings-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 184px;
  height: 30px;
  top: 8.66667px;
  left: 27px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: left;
}
.div__y-axis-controls-settings-radio-buttons {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 179px;
  height: 109px;
  top: 45px;
  left: 32px;
  padding: 5px;
  visibility: visible;
}

.span__y-axis-controls-settings-setup {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 184px;
  height: 30px;
  top: 134.667px;
  left: 27px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: left;
}

.span__y-axis-controls-settings-max-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 89px;
  height: 30px;
  top: 176.667px;
  left: 35px;
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
.div__y-axis-controls-settings-input-container {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 106px;
  height: 36px;
  top: 165.5px;
  left: 118.5px;
  visibility: visible;
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}
.span__y-axis-controls-settings-input-max-units {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 50px;
  height: 30px;
  top: 175.5px;
  left: 230px;
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

.span__y-axis-controls-settings-min-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 84px;
  height: 30px;
  top: 246.667px;
  left: 40px;
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
.div__y-axis-controls-settings-input-min-container {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(0, 0, 0);
  position: absolute;
  width: 106px;
  height: 36px;
  top: 236.667px;
  left: 118.5px;
  visibility: visible;
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}
.span__y-axis-controls-settings-input-min-units {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 50px;
  height: 30px;
  top: 246.667px;
  left: 230px;
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
</style>
