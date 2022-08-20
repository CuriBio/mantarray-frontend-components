<template>
  <div class="div__playback-x-axis-controls" :style="div__x_axis_controls__dynamic_style">
    <div class="div__playback-x-axis-controls-elements">
      <span class="span__playback-x-axis-controls-text">
        <!-- original mockflow ID: id="cmpDa8f4d0a246cfe9857aa113effcef236e" -->
        X-Axis Options:</span
      >

      <span
        v-b-popover.hover.top="x_axis_zoom_out"
        class="span__playback-x-axis-controls-zoom-out-button"
        :class="span__x_axis_controls_zoom_out_button__dynamic_class"
        :title="x_title_out"
        :delay="delayed"
        @click="zoom_x_out()"
      >
        <!-- original mockflow ID: id="cmpD007ad32f0901697c3a020e8667de9103_txt"-->
        <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
      </span>

      <span
        v-b-popover.hover.top="x_axis_zoom_in"
        class="span__playback-x-axis-controls-zoom-in-button"
        :class="span__x_axis_controls_zoom_in_button__dynamic_class"
        :title="x_title_in"
        :delay="delayed"
        @click="zoom_x_in()"
      >
        <!-- original mockflow ID: id="cmpDf47fe04ffb56d74063a73555d5892726_txt"-->
        <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
      </span>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import playback_module from "@/store/modules/playback";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
Vue.component("BButton", BButton);
import { VBPopover } from "bootstrap-vue";
// Note: Vue automatically prefixes the directive name with 'v-'
Vue.directive("b-popover", VBPopover);
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
 * @vue-data {Object} div__x_axis_controls__dynamic_style - Current dynamic x axis controls value
 * @vue-data {String} x_title_in - Tool tips title Zoom-in for X-Axis.
 * @vue-data {String} x_title_out - Tool tips title Zoom-out for X-Axis.
 * @vue-data {String} x_axis_zoom_in - Tool tips body in Zoom-in for X-Axis.
 * @vue-data {String} x_axis_zoom_out - Tool tips body in Zoom-out for X-Axis.
 * @vue-data {Int} delayed - Tool tips delay to show.
 * @vue-computed {Array} x_zoom_levels - Current Array in Vuex on the x_zoom_level store
 * @vue-computed {Int} zoom_level_idx - Current Index in Vuex on the x_zoom_level store
 * @vue-computed {Int} tooltips_delay - Current tooltips delay in Vuex store.
 * @vue-event {Event} zoom_x_in - Current method which handles X Axis Zoom in
 * @vue-event {Event} zoom_x_out - Current method which handles X Axis Zoom out
 * @vue-event {Event} tooltip_x_in - Current method which handles X Axis Zoom in Tooltip
 * @vue-event {Event} tooltip_x_out - Current method which handles X Axis Zoom out Tooltip
 */
export default {
  name: "XAxisControls",
  components: { FontAwesomeIcon },
  props: {
    css_top_anchor: { type: String, default: "0px" },
    css_left_anchor: { type: String, default: "0px" },
  },
  data: function () {
    return {
      // zoom_level_idx: 1,
      div__x_axis_controls__dynamic_style: {
        top: this.css_top_anchor,
        left: this.css_left_anchor,
      },
      x_title_in: "X-Axis",
      x_title_out: "X-Axis",
      x_axis_zoom_in: "Zoom-In",
      x_axis_zoom_out: "Zoom-Out",
      delayed: { show: this.tooltips_delay, hide: 0 },
    };
  },
  computed: {
    ...mapState("waveform", {
      x_zoom_levels: "x_zoom_levels",
      zoom_level_idx: "x_zoom_level_idx",
    }),
    ...mapState("playback", ["tooltips_delay"]),
    max_zoom_index: function () {
      return this.x_zoom_levels.length - 1;
    },
    span__x_axis_controls_zoom_out_button__dynamic_class: function () {
      this.tooltip_x_out();
      return {
        "div__playback-x-axis-controls--disabled": this.zoom_level_idx == 0,
        "div__playback-x-axis-controls--enabled": this.zoom_level_idx > 0,
      };
    },
    span__x_axis_controls_zoom_in_button__dynamic_class: function () {
      this.tooltip_x_in();
      return {
        "div__playback-x-axis-controls--disabled": this.zoom_level_idx == this.max_zoom_index,
        "div__playback-x-axis-controls--enabled": this.zoom_level_idx < this.max_zoom_index,
      };
    },
  },
  methods: {
    zoom_x_in() {
      if (this.zoom_level_idx < this.x_zoom_levels.length - 1) {
        this.$store.commit("waveform/set_x_axis_zoom_idx", this.zoom_level_idx + 1);
      }
    },
    zoom_x_out() {
      if (this.zoom_level_idx > 0) {
        this.$store.commit("waveform/set_x_axis_zoom_idx", this.zoom_level_idx - 1);
      }
    },
    tooltip_x_in() {
      if (this.zoom_level_idx == this.max_zoom_index) {
        this.x_title_in = "X-Axis Zoom-In";
        this.x_axis_zoom_in = "Maximum Zoom Reached";
      } else {
        this.x_title_in = "X-Axis";
        this.x_axis_zoom_in = "Zoom-In";
      }
    },
    tooltip_x_out() {
      if (this.zoom_level_idx == 0) {
        this.x_axis_zoom_out = "Minimum Zoom Reached";
        this.x_title_out = "X-Axis Zoom-Out";
      } else {
        this.x_title_out = "X-Axis";
        this.x_axis_zoom_out = "Zoom-Out";
      }
    },
  },
};
</script>
<style type="text/css">
.div__playback-x-axis-controls {
  height: 45px;
  width: calc(100vw - 353px);
  background-color: #1c1c1c;
  position: absolute;
  text-align: center;
  overflow: hidden;
  z-index: 5;
}
.div__playback-x-axis-controls-elements {
  height: 45px;
  width: 218px;
  margin: 0px auto;
}
.div__playback-x-axis-controls--enabled {
  color: rgb(183, 183, 183);
}
.div__playback-x-axis-controls--disabled {
  color: rgb(120, 120, 120);
}
.span__playback-x-axis-controls-text {
  pointer-events: all;
  line-height: 45px;
  overflow: hidden;
  position: relative;
  width: 134px;
  height: 45px;
  top: -5px;
  padding-right: 7px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 18px;
  color: rgb(255, 255, 255);
  text-align: right;
}
.span__playback-x-axis-controls-zoom-out-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  width: 35px;
  height: 35px;
  line-height: 45px;
  padding-right: 11px;
  font-size: 30px;
}
.span__playback-x-axis-controls-zoom-in-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  width: 35px;
  height: 35px;
  line-height: 45px;
  font-size: 30px;
}
.div__playback-x-axis-controls--enabled:hover {
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
</style>
