<template>
  <div class="div__playback-y-axis-controls" :style="div__y_axis_controls__dynamic_style">
    <!-- original mockflow ID:  id="cmpD2e85c27cb3ef7ba7539b1af8ed70e509"  -->
    <span class="span__playback-y-axis-controls-zoom-label"> (Absolute)</span>
    <div class="div__playback-y-axis-controls-zoom-control-icon" @click="zoom_controls()">
      <svg v-show="controls" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
        <path
          class="cls-1"
          d="M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0ZM17.5,43a7,7,0,1,1,7.1-7A7,7,0,0,1,17.5,43ZM36,43a7,7,0,1,1,7-7A7,7,0,0,1,36,43Zm18.5,0a7,7,0,1,1,7-7A7,7,0,0,1,54.5,43Z"
        />
      </svg>
      <svg v-show="!controls" id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
        <path
          class="cls-2"
          d="M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0ZM17.5,43a7,7,0,1,1,7.1-7A7,7,0,0,1,17.5,43ZM36,43a7,7,0,1,1,7-7A7,7,0,0,1,36,43Zm18.5,0a7,7,0,1,1,7-7A7,7,0,0,1,54.5,43Z"
        />
      </svg>
    </div>
    <span>
      <b-modal
        id="y-axis-controls-settings"
        size="sm"
        hide-footer
        hide-header
        hide-header-close
        :static="true"
      >
        <YAxisControlsSettings
          @y-axis-new-range="y_axis_controls_commit"
          @y-axis-no-change="y_axis_controls_cancel"
        />
      </b-modal>
    </span>
    <span
      v-b-popover.hover.right="y_axis_zoom_in"
      class="span__playback-y-axis-controls-zoom-in-button"
      :class="span__y_axis_controls_zoom_in_button__dynamic_class"
      :title="y_title_in"
      :delay="delayed"
      @click="zoom_y_in()"
    >
      <!-- original mockflow ID: id="cmpD7a3cb7a0fd60bf4ee9f02d12f49256a9_txt_grey"-->
      <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
    </span>

    <span
      v-b-popover.hover.right="y_axis_zoom_out"
      class="span__playback-y-axis-controls-zoom-out-button"
      :class="span__y_axis_controls_zoom_out_button__dynamic_class"
      :title="y_title_out"
      :delay="delayed"
      @click="zoom_y_out()"
    >
      <!-- original mockflow ID: id="cmpDfdd0efa1cbd01c2311392322a5ee14a7_txt_grey"-->
      <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
    </span>
    <span class="span__playback-y-axis-controls-text">
      <!-- original mockflow ID: id="cmpD36b265aa4aa7e8e542852a6bace9e9e3"-->
      Y-Axis Options:</span
    >
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import playback_module from "@/store/modules/playback";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import YAxisControlsSettings from "@/components/playback/controls/YAxisControlsSettings";
import { mapState } from "vuex";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
Vue.component("BButton", BButton);

import { VBPopover } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
Vue.component("BModal", BModal);

const stateObj = playback_module.state();
const vuex_delay = stateObj.tooltips_delay;

const options = {
  BTooltip: {
    delay: {
      show: 400,
      hide: 100,
    },
  },
  BPopover: {
    delay: {
      show: vuex_delay,
      hide: 50,
    },
  },
};

Vue.use(BootstrapVue, { ...options });

library.add(faMinusCircle);
library.add(faPlusCircle);
/**
 * @vue-prop {String} css_top_anchor - Current top anchor value in CSS
 * @vue-prop {String} css_left_anchor - Current left anchor value in CSS
 * @vue-prop {String} height - Current height value in CSS
 * @vue-data {Object} div__y_axis_controls__dynamic_style - Current dynamic x axis controls value
 * @vue-data {String} y_title_in - Tool tips title Zoom-in for X-Axis.
 * @vue-data {String} y_title_out - Tool tips title Zoom-out for X-Axis.
 * @vue-data {String} y_axis_zoom_in - Tool tips body in Zoom-in for X-Axis.
 * @vue-data {String} y_axis_zoom_out - Tool tips body in Zoom-out for X-Axis.
 * @vue-data {Int} delayed - Tool tips delay to show.
 * @vue-computed {Array} y_zoom_levels - Current Array in Vuex on the y_zoom_level store
 * @vue-computed {Int} zoom_level_idx - Current Index in Vuex on the y_zoom_level store
 * @vue-computed {Int} tooltips_delay - Current tooltips delay in Vuex store.
 * @vue-event {Event} zoom_y_in - Current method which handles Y Axis Zoom in
 * @vue-event {Event} zoom_y_out - Current method which handles Y Axis Zoom out
 * @vue-event {Event} tooltip_y_in - Current method which handles Y Axis Zoom in Tooltip
 * @vue-event {Event} tooltip_y_out - Current method which handles Y Axis Zoom out Tooltip
 */
export default {
  name: "YAxisControls",
  components: {
    FontAwesomeIcon,
    YAxisControlsSettings,
  },
  props: {
    css_top_anchor: { type: String, default: "0px" },
    css_left_anchor: { type: String, default: "0px" },
    height: { type: String, default: "930px" },
  },
  data: function () {
    return {
      div__y_axis_controls__dynamic_style: {
        top: this.css_top_anchor,
        left: this.css_left_anchor,
        height: this.height,
      },
      y_title_in: "Y-Axis",
      y_title_out: "Y-Axis",
      y_axis_zoom_in: "Zoom-In",
      y_axis_zoom_out: "Zoom-Out",
      delayed: { show: this.tooltips_delay, hide: 0 },
      controls: true,
    };
  },
  computed: {
    ...mapState("waveform", ["y_axis_scale", "y_axis_range"]),
    ...mapState("playback", ["tooltips_delay"]),
    min_window_size: function () {
      return Math.round(this.y_axis_scale) <= 1;
    },
    max_window_size: function () {
      const y_max = this.y_axis_scale + this.y_axis_range.midpoint;
      const y_min = this.y_axis_range.midpoint - this.y_axis_scale;
      return y_max > 100000 && y_min < -200;
    },
    span__y_axis_controls_zoom_out_button__dynamic_class: function () {
      this.tooltip_y_out();
      return {
        "div__playback-y-axis-controls--disabled": this.max_window_size,
        "div__playback-y-axis-controls--enabled": !this.max_window_size,
      };
    },
    span__y_axis_controls_zoom_in_button__dynamic_class: function () {
      this.tooltip_y_in();
      return {
        "div__playback-y-axis-controls--disabled": this.min_window_size,
        "div__playback-y-axis-controls--enabled": !this.min_window_size,
      };
    },
  },

  methods: {
    zoom_y_in: function () {
      if (!this.min_window_size) this.$store.commit("waveform/set_y_axis_zoom_in");
    },
    zoom_y_out: function () {
      if (!this.max_window_size) this.$store.commit("waveform/set_y_axis_zoom_out");
    },
    tooltip_y_out: function () {
      if (this.max_window_size) {
        this.y_title_out = "Y-Axis Zoom-Out";
        this.y_axis_zoom_out = "Minimum Zoom Reached";
      } else {
        this.y_title_out = "Y-Axis";
        this.y_axis_zoom_out = "Zoom-Out";
      }
    },
    tooltip_y_in: function () {
      if (this.min_window_size) {
        this.y_title_in = "Y-Axis Zoom-In";
        this.y_axis_zoom_in = "Maximum Zoom Reached";
      } else {
        this.y_title_in = "Y-Axis";
        this.y_axis_zoom_in = "Zoom-In";
      }
    },
    zoom_controls: function () {
      this.$bvModal.show("y-axis-controls-settings");
      this.controls = !this.controls;
    },
    y_axis_controls_commit: function ({ y_max, y_min }) {
      this.$bvModal.hide("y-axis-controls-settings");
      const midpoint = (y_max + y_min) / 2;
      const new_range = { min: y_min, max: y_max, midpoint };

      this.$store.commit("waveform/set_y_axis", new_range);
      this.controls = !this.controls;
    },
    y_axis_controls_cancel: function () {
      this.$bvModal.hide("y-axis-controls-settings");
      this.controls = !this.controls;
    },
  },
};
</script>
<style type="text/css">
.span__playback-y-axis-controls-zoom-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(270deg);
  overflow: hidden;
  position: absolute;
  width: 83px;
  height: 20px;
  top: 299.041px;
  left: -24.1984px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: italic;
  text-decoration: none;
  font-size: 15px;
  color: rgb(110, 111, 114);
  text-align: right;
}

.div__playback-y-axis-controls-zoom-control-icon {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  text-align: center;
  width: 29px;
  height: 29px;
  top: 355.404px;
  left: 7.5px;
  visibility: visible;
  filter: none;
}

.cls-1 {
  color: #b7b7b7;
  fill: #b7b7b7;
}

.cls-2 {
  color: #ececed;
  fill: #ececed;
}

.div__playback-y-axis-controls *,
.div__playback-y-axis-controls *:before,
.div__playback-y-axis-controls *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__playback-y-axis-controls {
  --span__playback-y-axis-controls-zoom-in-button--Top: 40%;

  width: 45px;
  background-color: #1c1c1c;
  position: absolute;
  color: rgb(183, 183, 183);
}

.div__playback-y-axis-controls--enabled *,
.div__playback-y-axis-controls--enabled *:before,
.div__playback-y-axis-controls--enabled *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__playback-y-axis-controls--enabled {
  color: rgb(183, 183, 183);
}

.div__playback-y-axis-controls--disabled *,
.div__playback-y-axis-controls--disabled *:before,
.div__playback-y-axis-controls--disabled *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__playback-y-axis-controls--disabled {
  color: rgb(120, 120, 120);
}

.span__playback-y-axis-controls-zoom-out-button {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  position: absolute;
  width: 35px;
  height: 35px;
  line-height: 35px;
  top: 435.904px;
  left: 4px;

  font-size: 30px;
}

.span__playback-y-axis-controls-zoom-in-button {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  position: absolute;
  width: 35px;
  height: 35px;
  line-height: 35px;
  top: 393.404px;
  left: 4px;
  font-size: 30px;
}

.span__playback-y-axis-controls-text {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(270deg);
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  width: 133px;
  height: 24px;
  top: 528.98px;
  left: -49px;
  padding: 5px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 18px;
  color: rgb(255, 255, 255);
  text-align: right;
}

.div__playback-y-axis-controls--enabled:hover {
  color: #ececed;
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
.modal-backdrop {
  background-color: rgb(0, 0, 0, 0.5);
}

#y-axis-controls-settings {
  position: fixed;
  top: 38%;
  right: 50%;
  left: -39%;
  bottom: 50%;
}
</style>
