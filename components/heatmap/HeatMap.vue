<template>
  <div>
    <!--  original mockflow ID:  cmpDf4f7dd55b2e166cb0d0e843ee15b7aad -->
    <div class="div__heatmap-layout-background"></div>

    <!--  original mockflow ID:  cmpDc41b1cc426d26a92a64089e70f3d6d88 -->
    <div class="div__heatmap-layout-twitch-force-label">{{ entrykey }} (μN)</div>

    <!--  original mockflow ID:  cmpDeb75716be024c38385f1f940d7d0551d -->
    <div class="div__heatmap-layout-heatmap-editor-widget">
      <PlateHeatMap :platecolor="passing_plate_colors" @platewell-selected="compute_mean"></PlateHeatMap>
    </div>

    <!-- original mockflow ID:   cmpD9bf89cc77f1d867d1b3f93e925ee43ce -->
    <div v-show="!is_mean_value_active" class="div__heatmap-layout-heatmap-well-label">Well A01 (μN):</div>

    <!-- original mockflow ID:  cmpDde968837816d0d1051ada7bf835872f8 -->
    <div v-show="!is_mean_value_active" class="div__heatmap-layout-heatmap-well-value">0</div>

    <!-- original mockflow ID: cmpD0f9518f2e3b32a8fd2907a6c9167ed79 -->
    <div v-show="is_mean_value_active" class="div__heatmap-layout-heatmap-mean-well-label">
      Mean of {{ well_selected_count }} Wells (μN):
    </div>

    <!-- original mockflow ID: cmpDbf7507b833445c460899c3735fd95527 -->
    <div v-show="is_mean_value_active" class="div__heatmap-layout-heatmap-mean-value-well-label">
      {{ mean_value }}
    </div>

    <!-- original mockflow ID: cmpDb59694a85eb967571cf98a41b5fa7481 -->
    <div class="div__heatmap-layout-heatmap-colorbar-container">
      <GradientBar :gradient_height="481" :gradient_width="40" :units="unit"></GradientBar>
    </div>

    <!-- original mockflow ID: cmpDceaaf3ae28ae1a3394f714f82cb8848d -->
    <div class="div__heatmap-layout-heatmap-settings-panel"></div>

    <!-- original mockflow ID: cmpD64bd4f78c20868d7dd5a9b4aa39bf217 -->
    <span class="span__heatmap-layout-heatmap-settings-label">Heatmap Settings</span>

    <!-- original mockflow ID: cmpD56369ad2e65893ae5ca594f14a64e378 -->
    <canvas class="canvas__heatmap-settings-title-seperator" width="272" height="2"> </canvas>

    <!-- original mockflow ID: cmpD9c0a6e873d03a7f83e8a68941610e993 -->
    <span class="span__heatmap-layout-heatmap-scale-label">Scale Bar</span>

    <!-- original mockflow ID:  cmpD5cceb38a3af00a6bd7589d883fa87688 -->
    <div class="div__heatmap-layout-checkbox-container">
      <CheckBoxWidget :checkbox_options="option" @checkbox-selected="auto_scale"></CheckBoxWidget>
    </div>

    <!-- original mockflow ID:  cmpD8a25d29c92a6f84cc071bcf466ca36ce -->
    <span class="span__heatmap-layout-checkbox-label">Auto&nbsp;<wbr />Scale</span>
    <!-- original mockflow ID:  cmpDda68e4034616b4f5e244dc57e815c027 -->
    <span class="span__heatmap-layout-maximum-label">Maximum</span>

    <!-- original mockflow ID:  cmpDb88cb7785bf9ca45549b1866c2c20122 -->
    <div class="div__heatmap-layout-maximum-input-container" width="121" height="52">
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
    <div class="div__heatmap-layout-minimum-input-container" width="121" height="52">
      <InputWidget
        :placeholder="'0'"
        :invalid_text="min_heatmap_value"
        :input_width="105"
        :dom_id_suffix="'min'"
        @update:value="on_update_minimum($event)"
      ></InputWidget>
    </div>

    <!-- original mockflow ID:  cmpD8d0ef3020c7613af7ae63fa5722de759  -->
    <canvas class="canvas__heatmap-settings-scale-seperator" width="212" height="2"> </canvas>

    <!-- original mockflow ID: cmpD4146e3d532d7eb0719ee0d6e06485940 -->
    <span class="span__heatmap-layout-display-label">Display</span>

    <!-- original mockflow ID: cmpDa1c3ce66a0c6d38c39ace76539269b2f  -->
    <div class="div__heatmap-layout-display-input-dropdown-container">
      <NewSelectDropDown
        :title_label="label"
        :value.sync="entrykey"
        :options_text="metric_names"
        :options_id="'display'"
        :input_width="entry_width"
        :input_height="input_height"
        @selection-changed="metric_selection_changed"
      />
    </div>

    <!-- original mockflow ID: cmpDc08190eb24c68e02c278bde19882becb -->
    <canvas class="canvas__heatmap-settings-color-scheme-seperator" width="212" height="2"> </canvas>

    <!-- original mockflow ID: cmpD03029ea224291e6817f40d3ac9f24b19 -->
    <span class="span__heatmap-settings-color-scheme-label"> Color Scheme</span>
    <div class="div__heatmap-radio-buttons-container">
      <RadioButtonWidget
        :radio_buttons="gradient_theme_names"
        :pre_selected="0"
        @radio-btn-selected="radio_option_selected"
      ></RadioButtonWidget>
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
      <canvas class="canvas__heatmap-settings-apply-btn-container"> </canvas>

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
      <canvas class="canvas__heatmap-settings-reset-btn-container"></canvas>

      <!-- original mockflow ID : cmpD2f909255bf15b8f4daa88ed03c6a8300_txt -->
      <span class="span__heatmap-settings-reset-btn-label" @click="reset_heatmap_settings"> Reset </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CheckBoxWidget from "@/components/basic_widgets/CheckBoxWidget.vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import NewSelectDropDown from "@/components/basic_widgets/NewSelectDropDown.vue";
import RadioButtonWidget from "@/components/basic_widgets/RadioButtonWidget.vue";
import GradientBar from "@/components/status/GradientBar.vue";
import PlateHeatMap from "@/components/plate_based_widgets/mapeditor/PlateHeatMap.vue";

export default {
  name: "HeatMap",
  components: {
    PlateHeatMap,
    GradientBar,
    InputWidget,
    NewSelectDropDown,
    CheckBoxWidget,
    RadioButtonWidget,
  },

  data() {
    return {
      option: [{ text: "", value: "Auto-Scale" }],
      label: "",
      entrykey: "Twitch Force",
      keyplaceholder: "Twitch Force",
      error_text: "An ID is required",
      entry_width: 201,
      disallow_entry: false,
      on_empty_flag: true,
      provided_uuid: "0",
      height: 481,
      is_apply_set: false,
      input_height: 45,
      unit: "μN",
      heatmap_option: "",
      max_heatmap_value: "invalid",
      min_heatmap_value: "invalid",
      is_mean_value_active: false,
      mean_value: 0,
      well_selected_count: 0,
    };
  },

  computed: {
    ...mapState("data", {
      well_values: "heatmap_values",
    }),
    metric_names: function () {
      return Object.keys(this.well_values);
    },
    ...mapState("gradient", {
      gradients: "gradients",
    }),
    ...mapGetters("gradient", {
      gradient_map: "gradient_color_mapping",
    }),
    gradient_theme_names: function () {
      return this.gradients.map((t) => t.name);
    },
    passing_plate_colors: function () {
      return this.well_values[this.entrykey].data.map((well) => {
        if (well.length > 0) {
          const average = (a) => a.reduce((x, y) => x + y) / a.length;
          return this.gradient_map(average(well.slice(-5)));
        } else {
          return "#B7B7B7";
        }
      });
    },
  },

  watch: {
    entrykey: function () {
      if (this.entrykey != "") {
        this.error_text = "Choose an option";
      } else {
        this.on_empty_flag = true;
        this.error_text = "An ID is required";
      }
      this.heatmap_option = this.entrykey;
      // const display_idx = this.well_values[this.entrykey];
      if (this.entrykey in this.well_values) {
        this.on_empty_flag = false;
        this.lower = this.well_values[this.entrykey].range_min;
        this.upper = this.well_values[this.entrykey].range_max;
        this.is_apply_set = true;
      } else {
        this.lower = null;
        this.upper = null;
        this.error_text = "Choose an option";
        this.on_empty_flag = true;
        this.is_apply_set = false;
      }
    },
  },

  methods: {
    auto_scale: function (new_value) {
      /* if (new_value == "Auto-Scale") { */
      /*   this.max_heatmap_value = ""; */
      /*   this.min_heatmap_value = ""; */
      /*   this.heatmap_option = this.entrykey = this.nicknames_list[0]; */
      /*   this.is_apply_set = true; */
      /*   this.$store.commit("heatmap/heatmap_autoscale", true); */
      /* } else { */
      /*   this.max_heatmap_value = "invalid"; */
      /*   this.min_heatmap_value = "invalid"; */
      /*   this.heatmap_option = this.entrykey = ""; */
      /*   this.is_apply_set = false; */
      /*   this.$store.commit("heatmap/heatmap_autoscale", false); */
      /* } */
    },

    metric_selection_changed: function (index) {
      this.entrykey = this.metric_names[index];
    },

    radio_option_selected: function (option_value) {
      const option_idx = option_value.index;
      if (this.gradient_theme_names[option_idx]) {
        this.$store.commit("gradient/set_gradient_theme_idx", option_idx);
      }
    },

    on_update_maximum: function (new_value) {
      const max = parseInt(new_value);
      if (new_value != "") {
        if (max < 0 || new_value == "-") {
          this.max_heatmap_value = "cannot be negative";
          this.is_apply_set = false;
        } else {
          if (max == this.lower) {
            this.max_heatmap_value = "max is equal to min";
            this.is_apply_set = false;
            this.upper = max;
          } else {
            if (max > this.lower) {
              this.upper = max;
              this.max_heatmap_value = "";
              if (this.min_heatmap_value == "" || this.min_heatmap_value == "min is more than max") {
                this.min_heatmap_value = "";
                this.is_apply_set = true;
              }
            } else {
              this.is_apply_set = false;
              this.upper = max;
              if (this.max_heatmap_value != "min is more than max") {
                this.max_heatmap_value = "min is more than max";
              }
            }
          }
        }
        if (max > 1000) {
          this.max_heatmap_value = "larger than 1000";
          this.is_apply_set = false;
        }
      } else {
        this.max_heatmap_value = "invalid";
        this.is_apply_set = false;
      }
    },

    on_update_minimum: function (new_value) {
      const min = parseInt(new_value);
      if (new_value != "") {
        if (min < 0 || new_value == "-") {
          this.min_heatmap_value = "cannot be negative";
          this.is_apply_set = false;
        } else {
          if (min == this.upper) {
            this.min_heatmap_value = "min is equal to max";
            this.is_apply_set = false;
            this.lower = min;
          } else {
            if (min < this.upper) {
              this.lower = min;
              this.min_heatmap_value = "";
              if (this.max_heatmap_value == "" || this.max_heatmap_value == "min is more than max") {
                this.max_heatmap_value = "";
                this.is_apply_set = true;
              }
            } else {
              this.is_apply_set = false;
              this.lower = min;
              if (this.min_heatmap_value != "min is more than max") {
                this.min_heatmap_value = "min is more than max";
              }
            }
          }
        }
        if (min > 1000) {
          this.min_heatmap_value = "larger than 1000";
          this.is_apply_set = false;
        }
      } else {
        this.min_heatmap_value = "invalid";
        this.is_apply_set = false;
      }
    },

    compute_mean: function (all_select) {
      let total = 0;
      this.well_selected_count = 0;
      this.is_mean_value_active = true;

      for (let i = 0; i < all_select.length; i++) {
        if (all_select[i] == true) {
          this.well_selected_count = this.well_selected_count + 1;
          total = total + this.well_values[this.entrykey].data[i];
        }
      }
      if (this.well_selected_count == 0) {
        this.is_mean_value_active = false;
      }
      this.mean_value = (total / this.well_selected_count).toFixed(3);
    },

    apply_heatmap_settings: function () {
      this.$store.commit("gradient/set_gradient_range", {
        min: this.lower,
        max: this.upper,
      });
    },

    reset_heatmap_settings: function () {
      this.upper_final = 0;
      this.upper = 0;
      this.lower_final = 0;
      this.lower = 0;
      this.entrykey = "Twitch Force";
      this.on_update_maximum("");
      this.on_update_minimum("");
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
  top: 347px;
  left: 1384px;
  padding: 5px;
  visibility: visible;
  z-index: 10;
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

.div__heatmap-settings-apply-btn-container-disable {
  background: #b7b7b7;
}

.div__heatmap-settings-apply-btn-container-enable {
  background: #b7b7b7;
}

.div__heatmap-settings-apply-btn-container-enable:hover {
  background: #19ac8a;
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

.div__heatmap-layout-display-input-dropdown-container > .div__input-dropdown-background {
  background: none;
  border: none;
}
</style>
