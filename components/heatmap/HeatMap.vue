<template>
  <div>
    <!--  original mockflow ID:  cmpDf4f7dd55b2e166cb0d0e843ee15b7aad -->
    <div class="div__heatmap-layout-background" />

    <!--  original mockflow ID:  cmpDc41b1cc426d26a92a64089e70f3d6d88 -->
    <div class="div__heatmap-layout-twitch-metric-label">{{ display_option }} ({{ unit }})</div>

    <!--  original mockflow ID:  cmpDeb75716be024c38385f1f940d7d0551d -->
    <div class="div__heatmap-layout-heatmap-editor-widget">
      <PlateHeatMap :platecolor="passing_plate_colors" />
    </div>

    <!-- Tanner (7/28/21): Could probably combine the following 4 components -->
    <!-- original mockflow ID:   cmpD9bf89cc77f1d867d1b3f93e925ee43ce -->
    <div v-show="!is_mean_value_active" class="div__heatmap-layout-heatmap-well-label">No Wells Selected</div>

    <!-- original mockflow ID:  cmpDde968837816d0d1051ada7bf835872f8 -->
    <div v-show="!is_mean_value_active" class="div__heatmap-layout-heatmap-well-value" />

    <!-- original mockflow ID: cmpD0f9518f2e3b32a8fd2907a6c9167ed79 -->
    <div v-show="is_mean_value_active" class="div__heatmap-layout-heatmap-mean-well-label">
      Mean of {{ selected_wells.length }} Wells ({{ unit }}):
    </div>

    <!-- original mockflow ID: cmpDbf7507b833445c460899c3735fd95527 -->
    <div v-show="is_mean_value_active" class="div__heatmap-layout-heatmap-mean-value-well-label">
      {{ mean_value }}
    </div>

    <!-- original mockflow ID: cmpDb59694a85eb967571cf98a41b5fa7481 -->
    <div class="div__heatmap-layout-heatmap-colorbar-container">
      <GradientBar :gradient_height="481" :gradient_width="40" :units="unit" />
    </div>

    <!-- original mockflow ID: cmpDceaaf3ae28ae1a3394f714f82cb8848d -->
    <div class="div__heatmap-layout-heatmap-settings-panel" />

    <!-- original mockflow ID: cmpD64bd4f78c20868d7dd5a9b4aa39bf217 -->
    <span class="span__heatmap-layout-heatmap-settings-label">Heatmap Settings</span>

    <!-- original mockflow ID: cmpD56369ad2e65893ae5ca594f14a64e378 -->
    <canvas class="canvas__heatmap-settings-title-separator" />

    <!-- original mockflow ID: cmpD9c0a6e873d03a7f83e8a68941610e993 -->
    <span class="span__heatmap-layout-heatmap-scale-label">Scale Bar</span>

    <!-- original mockflow ID:  cmpD5cceb38a3af00a6bd7589d883fa87688 -->
    <div class="div__heatmap-layout-checkbox-container">
      <CheckBoxWidget
        :checkbox_options="checkbox_options"
        :reset="checkbox_reset"
        :initial_selected="checkbox_state"
        @checkbox-selected="set_auto_scale"
      />
    </div>

    <!-- original mockflow ID:  cmpD8a25d29c92a6f84cc071bcf466ca36ce -->
    <span class="span__heatmap-layout-checkbox-label">Auto&nbsp;<wbr />Scale</span>
    <!-- original mockflow ID:  cmpDda68e4034616b4f5e244dc57e815c027 -->
    <span class="span__heatmap-layout-maximum-label">Maximum</span>

    <!-- original mockflow ID:  cmpDb88cb7785bf9ca45549b1866c2c20122 -->
    <div class="div__heatmap-layout-maximum-input-container" width="121" height="52">
      <InputWidget
        :placeholder="max_min_placeholder.max.toString()"
        :invalid_text="max_value_error_msg"
        :input_width="105"
        :dom_id_suffix="'heatmap-max'"
        :disabled="autoscale"
        :initial_value="upper.toString()"
        @update:value="!autoscale ? on_update_maximum($event) : null"
      />
    </div>

    <!-- original mockflow ID:  cmpDc06480c6344db8d23dca86a4c1e88ab4 -->
    <span class="span__heatmap-layout-minimum-input-container">Minimum</span>

    <!-- original mockflow ID:  cmpD1fda22cfac2b66c17a7f3def056669a0 -->
    <div class="div__heatmap-layout-minimum-input-container" width="121" height="52">
      <InputWidget
        :placeholder="max_min_placeholder.min.toString()"
        :invalid_text="min_value_error_msg"
        :input_width="105"
        :dom_id_suffix="'heatmap-min'"
        :disabled="autoscale"
        :initial_value="lower.toString()"
        @update:value="!autoscale ? on_update_minimum($event) : null"
      />
    </div>

    <!-- original mockflow ID:  cmpD8d0ef3020c7613af7ae63fa5722de759  -->
    <canvas class="canvas__heatmap-settings-scale-separator" width="212" height="2" />

    <!-- original mockflow ID: cmpD4146e3d532d7eb0719ee0d6e06485940 -->
    <span class="span__heatmap-layout-display-label">Display</span>

    <!-- original mockflow ID: cmpDa1c3ce66a0c6d38c39ace76539269b2f  -->
    <div class="div__heatmap-layout-display-input-dropdown-container">
      <SelectDropDown
        :title_label="label"
        :value.sync="display_option"
        :options_text="metric_names"
        :options_id="'display'"
        :options_idx="display_option_idx"
        :input_width="entry_width"
        :input_height="input_height"
        @selection-changed="metric_selection_changed"
      />
    </div>

    <!-- original mockflow ID: cmpDc08190eb24c68e02c278bde19882becb -->
    <canvas class="canvas__heatmap-settings-color-scheme-separator" width="212" height="2" />

    <!-- original mockflow ID: cmpD03029ea224291e6817f40d3ac9f24b19 -->
    <span class="span__heatmap-settings-color-scheme-label"> Color Scheme</span>
    <div class="div__heatmap-radio-buttons-container">
      <RadioButtonWidget
        :radio_buttons="gradient_theme_names"
        :pre_selected="color_theme_idx"
        @radio-btn-selected="radio_option_selected"
      />
    </div>

    <!-- orginal mockflow ID: cmpD5bc3214687200b065320c06b0a15e013 -->
    <span class="span__heatmap-settings-qc-options-label">QC Options</span>

    <!-- orginal mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7 -->
    <div
      class="div__heatmap-settings-apply-btn-container"
      :class="[
        !is_apply_set
          ? 'div__heatmap-settings-apply-btn-container-disable'
          : 'div__heatmap-settings-apply-btn-container-enable',
      ]"
    >
      <!-- orginal mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7_cvs -->
      <canvas class="canvas__heatmap-settings-apply-btn-container" />

      <!-- original mockflow ID: cmpD7fbcf0111303239acde2553d25be53f7_txt -->
      <span
        class="span__heatmap-settings-apply-btn-label"
        :class="[
          !is_apply_set
            ? 'span__heatmap-settings-apply-btn-label-disable'
            : 'span__heatmap-settings-apply-btn-label-enable',
        ]"
        @click="apply_heatmap_settings"
      >
        Apply
      </span>
    </div>

    <!-- original mockflow ID: cmpD2f909255bf15b8f4daa88ed03c6a8300 -->
    <div class="div__heatmap-settings-reset-btn-container">
      <!-- original mockflow ID: cmpD2f909255bf15b8f4daa88ed03c6a8300_cvs -->
      <canvas class="canvas__heatmap-settings-reset-btn-container" />

      <!-- original mockflow ID : cmpD2f909255bf15b8f4daa88ed03c6a8300_txt -->
      <span class="span__heatmap-settings-reset-btn-label" @click="reset_heatmap_settings"> Reset </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CheckBoxWidget from "@/components/basic_widgets/CheckBoxWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";
import GradientBar from "@/components/status/GradientBar.vue";
import PlateHeatMap from "@/components/plate_based_widgets/heatmap/PlateHeatMap.vue";
import playback_module from "@/store/modules/playback";
import { METRIC_UNITS } from "@/store/modules/heatmap/enums";

export default {
  name: "HeatMap",
  components: {
    PlateHeatMap,
    GradientBar,
    InputWidget,
    SelectDropDown,
    CheckBoxWidget,
    RadioButtonWidget,
  },
  data() {
    return {
      checkbox_options: [{ text: "", value: "autoscale" }],
      label: "",
      keyplaceholder: "Twitch Frequency",
      error_text: "An ID is required",
      entry_width: 201,
      disallow_entry: false,
      on_empty_flag: true,
      provided_uuid: "0",
      height: 481,
      input_height: 45,
      max_value_error_msg: "",
      min_value_error_msg: "",
      autoscale: false,
      upper: 1,
      lower: 0,
      checkbox_reset: false,
      checkbox_state: false,
      color_theme_idx: 0,
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES,
      metric_selection_idx: 0,
      max_min_placeholder: { min: 0, max: 1 },
    };
  },
  computed: {
    ...mapState("data", {
      well_values: "heatmap_values",
    }),
    ...mapState("heatmap", {
      display_option: "display_option",
      display_option_idx: "display_option_idx",
      selected_wells: "selected_wells",
      stored_auto_scale: "auto_scale",
    }),
    ...mapState("playback", ["playback_state"]),
    metric_names: function () {
      return Object.keys(this.well_values);
    },
    ...mapState("gradient", ["gradients", "gradient_theme_idx", "gradient_range_min", "gradient_range_max"]),
    ...mapGetters("gradient", {
      gradient_map: "gradient_color_mapping",
    }),
    gradient_theme_names: function () {
      return this.gradients.map((t) => {
        return { value: t.name };
      });
    },
    passing_plate_colors: function () {
      return this.well_values[this.display_option].data.map((well) => {
        const total = well.reduce((a, b) => a + b, 0);
        const mean = (total / well.length).toFixed(3);
        const color = this.gradient_map(mean);
        return well.length > 0 && color !== "rgb(0% 0% 0%)" ? color : "#b7b7b7";
      });
    },
    is_mean_value_active: function () {
      return this.selected_wells.length > 0;
    },
    mean_value: function () {
      let total = 0;
      this.selected_wells.map((well_idx) => {
        const well_data = this.well_values[this.display_option].data[well_idx];
        total += well_data.reduce((a, b) => a + b, 0) / well_data.length;
      });
      return (total / this.selected_wells.length).toFixed(3);
    },
    unit: function () {
      return METRIC_UNITS[this.display_option];
    },
    is_apply_set: function () {
      return (
        this.max_value_error_msg === "" &&
        this.min_value_error_msg === "" &&
        this.display_option in this.well_values &&
        (this.playback_state == this.playback_state_enums.LIVE_VIEW_ACTIVE ||
          this.playback_state == this.playback_state_enums.RECORDING)
      );
    },
    auto_max_min: function () {
      const max_value_array = this.well_values[this.display_option].data.map((well) => Math.max(...well));
      const min_value_array = this.well_values[this.display_option].data.map((well) => Math.min(...well));

      // conditional protects against when autoscale is true and a user selects apply when live view is off
      const range = {
        max: Math.max(...max_value_array) == -Infinity ? this.upper : Math.max(...max_value_array).toFixed(3),
        min: Math.min(...min_value_array) == Infinity ? this.lower : Math.min(...min_value_array).toFixed(3),
      };

      if (range.max === range.min) range.max = (Number(range.max) + 0.001).toString(); // guard against edge case where the max/min are the same
      return range;
    },
  },
  watch: {
    auto_max_min: function (new_value) {
      if (this.stored_auto_scale) {
        this.$store.commit("gradient/set_gradient_range", new_value);
        this.max_min_placeholder = {
          min: Math.floor(new_value.min),
          max: Math.ceil(new_value.max),
        };
        // the input box width cuts off decimal places so rounding vals
      }
    },
    playback_state: function (new_state, old_state) {
      // cleans up settings when live view becomes inactive
      if (
        old_state == this.playback_state_enums.LIVE_VIEW_ACTIVE &&
        new_state == this.playback_state_enums.CALIBRATED
      )
        this.reset_heatmap_settings();
    },
  },
  mounted() {
    this.autoscale = this.stored_auto_scale;
    this.checkbox_reset = !this.autoscale;
    this.checkbox_state = this.autoscale;
    this.color_theme_idx = this.gradient_theme_idx;

    this.lower = this.gradient_range_min;
    this.upper = this.gradient_range_max;
    this.max_min_placeholder = {
      min: Math.floor(this.gradient_range_min),
      max: Math.ceil(this.gradient_range_max),
    };
  },
  methods: {
    set_auto_scale: function (new_value) {
      if (new_value == "autoscale") {
        this.max_value_error_msg = "";
        this.min_value_error_msg = "";
        this.autoscale = true;
        this.checkbox_reset = false;
      } else {
        this.on_update_maximum(this.upper);
        this.on_update_minimum(this.lower);
        this.autoscale = false;
      }
    },

    metric_selection_changed: function (idx) {
      this.metric_selection_idx = idx;
    },

    radio_option_selected: function (option_value) {
      this.color_theme_idx = option_value.index;
    },
    on_update_maximum: function (new_value) {
      this.upper = parseFloat(new_value);
      if (isNaN(this.upper)) {
        this.max_value_error_msg = "invalid";
      } else if (this.upper < 0 || new_value[0] == "-") {
        this.max_value_error_msg = "cannot be negative";
      } else if (this.upper > 1000) {
        this.max_value_error_msg = "larger than 1000";
      } else if (this.upper < this.lower) {
        this.max_value_error_msg = "min is more than max";
      } else if (this.upper == this.lower) {
        this.max_value_error_msg = "max is equal to min";
      } else {
        // new value is valid
        this.max_value_error_msg = "";
        // update min error msg if caused by max value
        if (
          this.min_value_error_msg == "min is equal to max" ||
          this.min_value_error_msg == "min is more than max"
        ) {
          this.min_value_error_msg = "";
        }
      }
    },

    on_update_minimum: function (new_value) {
      this.lower = parseFloat(new_value);
      if (isNaN(this.lower)) {
        this.min_value_error_msg = "invalid";
      } else if (this.lower < 0 || new_value[0] == "-") {
        this.min_value_error_msg = "cannot be negative";
      } else if (this.lower > 1000) {
        this.min_value_error_msg = "larger than 1000";
      } else if (this.lower > this.upper) {
        this.min_value_error_msg = "min is more than max";
      } else if (this.lower == this.upper) {
        this.min_value_error_msg = "min is equal to max";
      } else {
        // new value is valid
        this.min_value_error_msg = "";
        // update max error msg if caused by min value
        if (
          this.max_value_error_msg == "max is equal to min" ||
          this.max_value_error_msg == "min is more than max"
        ) {
          this.max_value_error_msg = "";
        }
      }
    },
    apply_heatmap_settings: function () {
      if (this.is_apply_set) {
        this.$store.commit("heatmap/set_auto_scale", this.autoscale);
        this.$store.commit("heatmap/set_display_option_idx", this.metric_selection_idx);
        this.$store.commit("heatmap/set_display_option", this.metric_names[this.metric_selection_idx]);
        this.$store.commit("gradient/set_gradient_theme_idx", this.color_theme_idx);
        this.$store.commit("gradient/set_gradient_range", {
          min: this.autoscale ? this.auto_max_min.min : this.lower,
          max: this.autoscale ? this.auto_max_min.max : this.upper,
        });
      }
    },

    reset_heatmap_settings: function () {
      // reset autoscale setting to false
      this.$store.commit("heatmap/set_auto_scale", false);

      // reset display dropdown
      this.metric_selection_changed(0);
      this.$store.commit("heatmap/set_display_option", this.metric_names[this.metric_selection_idx]);
      this.$store.commit("heatmap/set_display_option_idx", this.metric_selection_idx);

      // reset gradient theme, radio button is subscribed to this mutation and will reset itself
      this.$store.commit("gradient/reset_gradient_theme_idx");
      // reset gradient range, min/max input text boxes are subscribed to this mutation will update themselves
      this.$store.commit("gradient/reset_gradient_range", {
        min: 0,
        max: 1,
      });
      // reset autoscale check box and disable setting for inputs
      this.on_update_maximum(1);
      this.on_update_minimum(0);
      this.checkbox_reset = true;
      this.autoscale = false;
      this.color_theme_idx = 0;
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
  width: 1629px;
  height: 885px;
  top: 0px;
  left: 0px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
}

.div__heatmap-layout-twitch-metric-label {
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
  width: 288px;
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

.div__heatmap-layout-heatmap-mean-well-label {
  line-height: 1;
  transform: rotate(0deg);
  padding: 5px;
  margin: 0px;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 631px;
  left: 287.455px;
  width: 288px;
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
  z-index: 76;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-mean-value-well-label {
  line-height: 1;
  transform: rotate(0deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(255, 255, 255);
  font-family: Muli;
  position: absolute;
  top: 631px;
  left: 537.455px;
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
  z-index: 78;
  pointer-events: all;
}

.div__heatmap-layout-heatmap-colorbar-container {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  /*background: linear-gradient(rgb(189, 53, 50), rgb(249, 215, 140));*/
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
  left: 1331px;
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
  top: 17px;
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

.canvas__heatmap-settings-title-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 260px;
  height: 2px;
  top: 55px;
  left: 1350px;
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
  top: 69px;
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

.div__heatmap-layout-checkbox-container {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 50px;
  height: 50px;
  top: 107px;
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
  top: 108px;
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
  top: 145px;
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
  top: 134px;
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
  top: 205px;
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
  top: 196px;
  left: 1473.44px;
  visibility: visible;
}

.canvas__heatmap-settings-scale-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 212px;
  height: 2px;
  top: 260px;
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
  width: 300px;
  height: 30px;
  top: 268px;
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
  top: 302px;
  left: 1384px;
  padding: 5px;
  visibility: visible;
  z-index: 10;
}

.canvas__heatmap-settings-color-scheme-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 212px;
  height: 2px;
  top: 372px;
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
  width: 300px;
  height: 30px;
  top: 382px;
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
  top: 413px;
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
  top: 553px;
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

.div__heatmap-settings-apply-btn-container-disable {
  background: #b7b7b7;
}

.div__heatmap-settings-apply-btn-container-enable {
  background: #b7b7b7;
}

.div__heatmap-settings-apply-btn-container-enable:hover {
  background: #19ac8a;
  cursor: pointer;
}

.canvas__heatmap-settings-apply-btn-container {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 130px;
  height: 55px;
  top: 0px;
  left: 0px;
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
}

.span__heatmap-settings-apply-btn-label-disable {
  color: #6e6f72;
}

.span__heatmap-settings-apply-btn-label-enable {
  color: rgb(0, 0, 0);
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
  background: #b7b7b7;
}

.div__heatmap-settings-reset-btn-container:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}

.canvas__heatmap-settings-reset-btn-container {
  -webkit-transform: translateZ(0);
  position: absolute;
  width: 130px;
  height: 55px;
  top: 0px;
  left: 0px;
  /* background: #b7b7b7; */
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

.div__heatmap-layout-display-input-dropdown-container > .div__input-dropdown-background {
  background: none;
  border: none;
}
</style>
