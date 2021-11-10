<template>
  <div>
    <!-- original mockflow ID:  id="cmpD0bdbd5699263f6535bd7dffbc49c09fb" -->
    <canvas class="canvas__y-axis-control-settings-background" width="295" height="350"> </canvas>
    <!-- original mockflow ID:  id="cmpDd424de000684523a198de85a85b9fba1" -->
    <span class="span__y-axis-control-settings-label">Y-Axis&nbsp;<wbr />Display&nbsp;<wbr />Mode</span>
    <!-- original mockflow ID:  id="cmpD99791429192bc48b7499cdcba2cc72ea" -->
    <div class="div__y-axis-controls-settings-radio-buttons">
      <RadioButtonWidget :radio_buttons="button_names_valid" :pre_selected="0"> </RadioButtonWidget>
      <RadioButtonWidget
        v-b-popover.hover.right="
          'Suggestions for different normalization, offset, and other display modes are welcome.'
        "
        :radio_buttons="button_names_future"
        :title="'Feature under development'"
      />
    </div>
    <!-- original mockflow ID: id="cmpD0b403c0dbaf4c4a4549aee8d1fe4810d" -->
    <span class="span__y-axis-controls-settings-setup">Set&nbsp;<wbr />Y-Axis&nbsp;<wbr />Values</span>
    <!-- original mockflow ID:  id="cmpDdb444fd5c7d0c3187e97bca0d24de0ee" -->
    <span class="span__y-axis-controls-settings-max-value">Maximum:</span>
    <!-- original mockflow ID:  id="cmpD6a9398a35a4e46ab44ef8d7d37256767" -->
    <div class="div__y-axis-controls-settings-input-container">
      <InputWidget
        :placeholder="'1000'"
        :dom_id_suffix="'max'"
        :invalid_text="max_value_error_msg"
        :input_width="106"
        @update:value="on_update_max_value($event)"
      />
    </div>
    <!-- original mockflow ID: id="cmpD549973a497f2bedf77cd8fd2d19b7948" -->
    <!-- Tanner (7/30/21): it might be nice to eventually make the unit part of the props so it's configurable -->
    <span class="span__y-axis-controls-settings-input-max-units">µN</span>
    <!-- original mockflow ID: id="cmpDfd4427b907fb9a6aeb301b47d0146569" -->
    <span class="span__y-axis-controls-settings-min-value">Minimum:</span>
    <!-- original mockflow ID: id="cmpD6a9398a35a4e46ab44ef8d7d37256767" -->
    <div class="div__y-axis-controls-settings-input-min-container">
      <InputWidget
        :placeholder="'0'"
        :dom_id_suffix="'min'"
        :invalid_text="min_value_error_msg"
        :input_width="106"
        @update:value="on_update_min_value($event)"
      />
    </div>
    <!-- original mockflow ID: id="cmpD549973a497f2bedf77cd8fd2d19b7948" -->
    <span class="span__y-axis-controls-settings-input-min-units">µN</span>
    <div style="top: 309px; left: 0px; position: absolute; z-index: 38">
      <ButtonWidget
        :button_widget_width="298"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btn_names_y_axis_widget"
        :enabled_color="visible_color_y_axis_widget"
        :disabled_color="hide_color_y_axis_widget"
        :hover_color="hover_colors_y_axis_widget"
        :is_enabled="enable_list_y_axis_widget"
        @btn-click="user_selection"
      />
    </div>
  </div>
</template>
<script>
import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { VBPopover } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);

const options = {
  BTooltip: {
    delay: {
      show: 400,
      hide: 100,
    },
  },
  BPopover: {
    delay: {
      show: 2000,
      hide: 50,
    },
  },
};

Vue.use(BootstrapVue, { ...options });

export default {
  name: "YAxisControlsSettings",
  components: {
    RadioButtonWidget,
    InputWidget,
    ButtonWidget,
  },
  data() {
    return {
      button_names_valid: [{ text: "Absolute", value: "Absolute", disabled: false }],
      button_names_future: [
        {
          text: "Baseline Standard",
          value: "Baseline Standard",
          disabled: true,
        },
        { text: "...", value: "...", disabled: true },
      ],
      max_value_error_msg: "invalid",
      min_value_error_msg: "invalid",
      maximum: "",
      minimum: "",
    };
  },
  created: function () {
    this.btn_names_y_axis_widget = ["Apply", "Cancel"];
    this.enable_list_y_axis_widget = [false, true];
    this.visible_color_y_axis_widget = "#B7B7B7";
    this.hide_color_y_axis_widget = "#3F3F3F";
    this.hover_colors_y_axis_widget = ["#FFFFFF", "#FFFFFF"];
  },
  methods: {
    on_update_max_value: async function (new_value) {
      const max_value = parseFloat(new_value);
      if (max_value < 0) {
        this.max_value_error_msg = "cannot be negative";
        this.enable_list_y_axis_widget = [false, true];
      } else if (max_value > 1000000) {
        this.max_value_error_msg = "must be <= 100000";
        this.enable_list_y_axis_widget = [false, true];
      } else if (new_value == "" || new_value == "-") {
        this.max_value_error_msg = "invalid";
        this.enable_list_y_axis_widget = [false, true];
      } else {
        this.max_value_error_msg = "";
        if (this.minimum != "") {
          if (this.minimum < this.maximum) {
            this.enable_list_y_axis_widget = [true, true];
          }
        }
      }
      this.maximum = max_value;
      if (new_value == "" || new_value == "-") {
        this.max_value_error_msg = "invalid";
        this.enable_list_y_axis_widget = [false, true];
      }
      await this.on_update_min_value(this.minimum);
    },
    on_update_min_value: function (new_value) {
      const min_value = parseFloat(new_value);
      if (min_value < -200) {
        this.min_value_error_msg = "must be >= -200";
        this.enable_list_y_axis_widget = [false, true];
      } else if (min_value >= this.maximum || isNaN(this.maximum)) {
        this.max_value_error_msg = "min greater than max";
        this.min_value_error_msg = "min greater than max";
        this.enable_list_y_axis_widget = [false, true];
      } else if (this.max_value_error_msg === "must be <= 100000") {
        this.enable_list_y_axis_widget = [false, true];
        this.min_value_error_msg = "";
      } else {
        this.enable_list_y_axis_widget = [true, true];
        this.min_value_error_msg = "";
        this.max_value_error_msg = "";
      }
      this.minimum = min_value;
      if (new_value === "" || new_value === "-" || isNaN(min_value)) {
        this.min_value_error_msg = "invalid";
        this.enable_list_y_axis_widget = [false, true];
        if (isNaN(this.maximum)) this.max_value_error_msg = "invalid";
      }
      if ((new_value == "" && this.maximum < 0) || this.maximum < 0) {
        this.max_value_error_msg = "cannot be negative";
        this.enable_list_y_axis_widget = [false, true];
      }
    },
    user_selection: function (btn_id) {
      const y_zoom = {
        y_min: this.minimum,
        y_max: this.maximum,
      };
      if (btn_id == 0) {
        // user has selected Apply
        this.$emit("y-axis-new-range", y_zoom);
      } else {
        // user has selected Cancel
        this.$emit("y-axis-no-change");
      }
    },
  },
};
</script>
<style type="text/css">
.canvas__y-axis-control-settings-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 301px;
  height: 359px;
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
  position: absolute;
  top: 45px;
  left: 32px;
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
  left: 128.5px;
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
  left: 235px;
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
  left: 128.5px;
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
  left: 235px;
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

* {
  -webkit-font-smoothing: antialiased;
}

.popover {
  border-color: #ececed;
  opacity: 0.95;
}

/* Simple CSS property to make popover title bold */
.popover-header {
  font-weight: 700;
  background-color: #f7f7f7;
  font-size: 12px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}

/* Bootstrap version 4.4.1 the present tip has the .popover property with a property
   font-size: 0.875rem;
   insipite overriding the value in .popover-body with a user defined
   value say font-size: 12px it was observed during testing it was
   getting resolving to a value of 12 * 0.875 ==> 10.5px
   To maintain the ambiance of the design we have set the value to
   componesate this reduction and now .popover-body has the following
   font-size: 14px;
   This results in resolving to a value of 14 * 0.875 ==> 12.25px
   Please note if you intented to change always try to multiple by a
   factor of 0.875 with which ever value to get the real font-size */
.popover-body {
  font-weight: 400;
  color: #000000;
  background-color: #ffffff;
  font-size: 14px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}
</style>
