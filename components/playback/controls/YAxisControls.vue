<template>
  <div
    class="div__playback-y-axis-controls"
    :style="div__y_axis_controls__dynamic_style"
  >
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
  components: { FontAwesomeIcon },
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
    };
  },
  computed: {
    ...mapState("waveform", {
      y_zoom_levels: "y_zoom_levels",
    }),
    ...mapState("waveform", {
      zoom_level_idx: "y_zoom_level_idx",
    }),
    ...mapState("playback", {
      tooltips_delay: "tooltips_delay",
    }),

    max_zoom_index: function () {
      return this.y_zoom_levels.length - 1;
    },

    span__y_axis_controls_zoom_out_button__dynamic_class: function () {
      this.tooltip_y_out();
      return {
        "div__playback-y-axis-controls--disabled": this.zoom_level_idx == 0,
        "div__playback-y-axis-controls--enabled": this.zoom_level_idx > 0,
      };
    },
    span__y_axis_controls_zoom_in_button__dynamic_class: function () {
      this.tooltip_y_in();
      return {
        "div__playback-y-axis-controls--disabled":
          this.zoom_level_idx == this.max_zoom_index,
        "div__playback-y-axis-controls--enabled":
          this.zoom_level_idx < this.max_zoom_index,
      };
    },
  },

  methods: {
    zoom_y_in: function () {
      if (this.zoom_level_idx < this.y_zoom_levels.length - 1) {
        this.$store.commit(
          "waveform/set_y_axis_zoom_idx",
          this.zoom_level_idx + 1
        );
      }
    },
    zoom_y_out: function () {
      if (this.zoom_level_idx > 0) {
        this.$store.commit(
          "waveform/set_y_axis_zoom_idx",
          this.zoom_level_idx - 1
        );
      }
    },
    tooltip_y_out: function () {
      if (this.zoom_level_idx == 0) {
        this.y_title_out = "Y-Axis Zoom-Out";
        this.y_axis_zoom_out = "Minimum Zoom Reached";
      } else {
        this.y_title_out = "Y-Axis";
        this.y_axis_zoom_out = "Zoom-Out";
      }
    },
    tooltip_y_in: function () {
      if (this.zoom_level_idx == this.max_zoom_index) {
        this.y_title_in = "Y-Axis Zoom-In";
        this.y_axis_zoom_in = "Maximum Zoom Reached";
      } else {
        this.y_title_in = "Y-Axis";
        this.y_axis_zoom_in = "Zoom-In";
      }
    },
  },
};
</script>
<style type="text/css">
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
</style>
