<template>
  <div>
    <div class="div__sidebar">
      <div class="div__sidebar-page-divider" />
      <div class="div__accordian-container" role="tablist">
        <div
          role="tab"
          @click="handle_tab_visibility(0)"
          @mouseenter="data_acquisition_hover = true"
          @mouseleave="data_acquisition_hover = false"
        >
          <div
            v-b-toggle.data-acquisition-card
            class="div__accordian-tabs"
            :class="data_acquisition_dynamic_class"
          >
            Data Acquisition
          </div>
          <div
            class="div__arrow"
            :class="{ expanded: data_acquisition_visibility }"
            :style="data_acquisition_hover ? 'border-top: 6px solid #000' : null"
          />
        </div>
        <b-collapse id="data-acquisition-card" visible accordion="controls-accordion" role="tabpanel">
          <div class="div__plate-barcode-container">
            <BarcodeViewer />
          </div>
          <div class="div__plate-navigator-container">
            <PlateNavigator />
          </div>
          <div class="div__status-bar-container">
            <StatusBar :confirmation_request="confirmation_request" @send_confirmation="send_confirmation" />
          </div>
          <div class="div__player-controls-container">
            <DesktopPlayerControls />
          </div>
          <div
            class="div__screen-view-options-text"
            :class="[
              beta_2_mode
                ? 'span__screen-view-options-text--beta-2-mode'
                : 'span__screen-view-options-text--beta-1-mode',
            ]"
          >
            Screen View Options
          </div>
          <div
            class="div__screen-view-container"
            :class="[
              beta_2_mode
                ? 'div__screen-view-container--beta-2-mode'
                : 'div__screen-view-container--beta-1-mode',
            ]"
          >
            <div class="div__waveform-screen-view">
              <!-- Default view is waveform screen -->
              <NuxtLink to="/">
                <img v-b-popover.hover.bottom="'Click to view Live View'" :title="'Live View'" />
              </NuxtLink>
            </div>
            <div class="div__heatmap-screen-view">
              <NuxtLink to="/heatmap">
                <img v-b-popover.hover.bottom="'Click to view Heat Map'" :title="'Heat Map'" />
              </NuxtLink>
            </div>
          </div>
        </b-collapse>
        <div
          role="tab"
          @click="handle_tab_visibility(1)"
          @mouseenter="stim_studio_hover = true"
          @mouseleave="stim_studio_hover = false"
        >
          <div v-b-toggle.stim-studio-card class="div__accordian-tabs" :class="stim_studio_dynamic_class">
            Stimulation Studio
          </div>
          <div
            class="div__arrow"
            :class="{ expanded: stim_studio_visibility }"
            :style="stim_studio_hover ? 'border-top: 6px solid #000' : null"
          />
        </div>
        <b-collapse id="stim-studio-card" accordion="controls-accordion" role="tabpanel">
          <div class="div__stim-barcode-container">
            <BarcodeViewer :barcode_type="'stim_barcode'" />
          </div>
          <div class="div__stim-status-container">
            <StatusBar
              :confirmation_request="confirmation_request"
              :stim_specific="true"
              @send_confirmation="send_confirmation"
            />
          </div>
          <div
            class="div__stimulation_controls-controls-icon-container"
            :class="[
              beta_2_mode
                ? 'div__stimulation_controls-controls-icon-container--beta-2-mode'
                : 'div__stimulation_controls-controls-icon-container--beta-1-mode',
            ]"
          >
            <StimulationControls />
            <NuxtLink to="/stimulationstudio">
              <div
                v-b-popover.hover.bottom="'Click to view Stimulation Studio'"
                :title="'Stimulation Studio'"
                class="div__stim-studio-screen-view"
              />
            </NuxtLink>
          </div>
        </b-collapse>
        <div
          role="tab"
          @click="handle_tab_visibility(2)"
          @mouseenter="data_analysis_hover = true"
          @mouseleave="data_analysis_hover = false"
        >
          <div v-b-toggle.data-analysis-card class="div__accordian-tabs" :class="data_analysis_dynamic_class">
            Data Analysis
          </div>
          <div
            class="div__arrow"
            :class="{ expanded: data_analysis_visibility }"
            :style="data_analysis_hover ? 'border-top: 6px solid #000' : null"
          />
        </div>
        <b-collapse id="data-analysis-card" accordion="controls-accordion" role="tabpanel">
          <DataAnalysisControl />
        </b-collapse>
      </div>
      <div class="div__simulation-mode-container">
        <SimulationMode />
      </div>
      <span class="span__copyright"
        >&copy;{{ current_year }} Curi Bio. All Rights Reserved. Version:
        {{ package_version }}
      </span>
    </div>
    <div class="div__top-bar-above-waveforms">
      <StimulationRunningWidget />
      <div class="div__recording-top-bar-container">
        <UploadFilesWidget />
        <RecordingTime />
      </div>
    </div>
    <div class="div__nuxt-page">
      <nuxt />
    </div>
  </div>
</template>
<script>
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";
import DesktopPlayerControls from "@/components/playback/controls/player/DesktopPlayerControls.vue";
import DataAnalysisControl from "@/components/playback/controls/data_analysis/DataAnalysisControl.vue";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";
import BarcodeViewer from "@/components/playback/controls/BarcodeViewer.vue";
import PlateNavigator from "@/components/plate_based_widgets/navigator/PlateNavigator.vue";
import StatusBar from "@/components/status/StatusBar.vue";
import SimulationMode from "@/components/status/SimulationMode.vue";
import RecordingTime from "@/components/status/RecordingTime.vue";
import StimulationRunningWidget from "@/components/status/StimulationRunningWidget.vue";

import { mapState } from "vuex";

import Vue from "vue";
import { VBPopover, VBToggle, BCollapse } from "bootstrap-vue";

// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
Vue.directive("b-toggle", VBToggle);
// const pkginfo = require('pkginfo')(module, 'version');

export default {
  components: {
    PlateNavigator,
    BarcodeViewer,
    DesktopPlayerControls,
    StatusBar,
    SimulationMode,
    RecordingTime,
    StimulationControls,
    UploadFilesWidget,
    DataAnalysisControl,
    StimulationRunningWidget,
    BCollapse,
  },
  data: function () {
    return {
      // package_version: module.exports.version,
      package_version: "0.0.0", // Eli (7/13/20): This only displays the application version when running from a built application---otherwise it displays the version of Electron that is installed
      current_year: "2022",
      confirmation_request: false,
      beta_2_mode: true,
      log_dir_name: "C:\\Users\\username\\AppData\\Roaming\\MantarrayController\\logs_flask",
      data_acquisition_visibility: true,
      stim_studio_visibility: false,
      data_analysis_visibility: false,
      data_analysis_hover: false,
      data_acquisition_hover: false,
      stim_studio_hover: false,
    };
  },
  computed: {
    ...mapState("settings", [
      "user_account",
      "active_user_index",
      "allow_sw_update_install",
      "recordings_list",
      "root_recording_path",
    ]),
    ...mapState("playback", ["data_analysis_state"]),
    data_acquisition_dynamic_class: function () {
      return this.data_acquisition_visibility ? "div__accordian-tabs-visible" : "div__accordian-tabs";
    },
    stim_studio_dynamic_class: function () {
      return this.stim_studio_visibility ? "div__accordian-tabs-visible" : "div__accordian-tabs";
    },
    data_analysis_dynamic_class: function () {
      return this.data_analysis_visibility ? "div__accordian-tabs-visible" : "div__accordian-tabs";
    },
  },
  created: async function () {
    // init store values needed in pages here since this side bar is only created once
    this.$store.commit("data/set_heatmap_values", {
      "Twitch Frequency": { data: [...Array(24)].map((_) => Array(0)) },
      "Twitch Force": { data: [...Array(24)].map((_) => Array(0)) },
    });

    this.$store.commit("waveform/set_x_axis_zoom_idx", 2);
    this.$store.commit("waveform/set_x_axis_zoom_levels", [
      { x_scale: 30 * 1e6 },
      { x_scale: 15 * 1e6 },
      { x_scale: 5 * 1e6 },
      { x_scale: 2 * 1e6 },
      { x_scale: 1 * 1e6 },
    ]);
  },
  methods: {
    send_confirmation: function (idx) {
      this.confirmation_request = false;
    },
    handle_tab_visibility: function (tab) {
      if (tab === 0) {
        this.data_acquisition_visibility = !this.data_acquisition_visibility;
        this.data_analysis_visibility = false;
        this.stim_studio_visibility = false;
      } else if (tab === 1) {
        this.data_acquisition_visibility = false;
        this.data_analysis_visibility = false;
        this.stim_studio_visibility = !this.stim_studio_visibility;
      } else if (tab === 2) {
        this.data_acquisition_visibility = false;
        this.data_analysis_visibility = !this.data_analysis_visibility;
        this.stim_studio_visibility = false;
      }
    },
  },
};
</script>

<style type="text/css">
body {
  background-color: #000000;
}
.div__nuxt-page {
  position: absolute;
  top: 0px;
  left: 289px;
}

/* ACCORDIAN*/
#stim-studio-card {
  padding-bottom: 10px;
}
#data-acquisition-card {
  padding: 5px 0px 10px 0px;
}
.div__accordian-container {
  top: 45px;
  position: absolute;
  width: 287px;
}
.div__accordian-tabs {
  background-color: #000;
  color: #b7b7b7;
  font-family: Muli;
  width: 287px;
  height: 40px;
  border-top: 2px solid #1c1c1c;
  border-bottom: 2px solid #1c1c1c;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  text-align: left;
  padding-top: 5px;
  padding-left: 15px;
}
.div__accordian-tabs:hover,
.div__accordian-tabs-visible:hover {
  background-color: #b7b7b7c9;
  color: #000;
}
.div__accordian-tabs-visible {
  background-color: #b7b7b7;
  color: #000;
}

/* NON-SPECIFIC */
.div__arrow {
  position: relative;
  top: -21px;
  left: 260px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #b7b7b7c9;
  width: 9px;
  transform: rotateZ(0deg) translateY(0px);
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
}
.expanded {
  transform: rotateZ(180deg) translateY(2px);
  border-top: 6px solid #000;
}
.arrow_hover {
  border-top: 6px solid #000;
}
.div__top-bar-above-waveforms {
  position: absolute;
  left: 289px;
  background-color: #111111;
  height: 45px;
  width: 1629px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.div__recording-top-bar-container {
  float: right;
  position: relative;
  height: 45px;
  width: 650px;
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.div__sidebar {
  background-color: #1c1c1c;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 930px;
  width: 287px;
}
.div__sidebar-page-divider {
  position: absolute;
  top: 0px;
  left: 287px;
  width: 2px;
  height: 930px;
  background-color: #0e0e0e;
}

/* DATA-ACQUISITION */
.div__screen-view-container {
  position: relative;
  width: 287px;
  display: grid;
  grid-template-columns: 50% 50%;
  justify-items: center;
}
.div__plate-barcode-container {
  position: relative;
  left: 0px;
}
.div__status-bar-container {
  position: relative;
  left: 0px;
}
.div__plate-navigator-container {
  position: relative;
  top: 5px;
  left: 0px;
}
.div__screen-view-options-text {
  line-height: 100%;
  position: relative;
  width: 207px;
  height: 23px;
  left: 11px;
  padding: 5px;
  user-select: none;
  font-size: 16px;
  color: #ffffff;
  text-align: left;
  margin: 10px;
}
.div__waveform-screen-view- {
  grid-column: 1 / 2;
}
.div__heatmap-screen-view- {
  grid-column: 2;
}
.div__player-controls-container {
  position: relative;
  left: 0px;
  margin: 5px 0;
}

/* STIM STUDIO */
.div__stim-status-container {
  position: relative;
  margin-top: 8px;
}
.div__stim-barcode-container {
  position: relative;
  left: 0px;
  margin-top: 10px;
}
.div__stimulation_controls-controls-icon-container {
  position: relative;
  margin-top: 3px;
  left: 0px;
}
.div__stim-studio-screen-view {
  position: absolute;
  top: 32px;
  left: 7px;
  width: 44px;
  height: 44px;
  opacity: 0;
}

/* STIMULATION/COPYRIGHT */
.div__simulation-mode-container {
  position: absolute;
  top: 875px;
}
.span__copyright {
  position: absolute;
  z-index: 99;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  line-height: 100%;
  overflow: hidden;
  width: 286px;
  height: 16px;
  top: 907px;
  left: -0.252101px;
  padding: 5px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 9px;
  color: #ffffff;
  text-align: center;
}
</style>
