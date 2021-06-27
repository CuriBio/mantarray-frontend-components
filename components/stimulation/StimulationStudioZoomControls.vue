<template>
  <div class="div__playback-x-axis-controls">
    <div class="div__playback-x-axis-controls-elements">
      <span
        v-b-popover.hover.top="x_axis_zoom_out"
        class="span__playback-x-axis-controls-zoom-out-button"
        :class="span__x_axis_controls_zoom_out_button__dynamic_class"
        :title="x_title_out"
        @click="zoom_x_out()"
      >
        <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
      </span>

      <span
        v-b-popover.hover.top="x_axis_zoom_in"
        class="span__playback-x-axis-controls-zoom-in-button"
        :class="span__x_axis_controls_zoom_in_button__dynamic_class"
        :title="x_title_in"
        @click="zoom_x_in()"
      >
        <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
      </span>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
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
Vue.use(BootstrapVue);
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
  name: "StimulationStudioZoomControls",
  components: { FontAwesomeIcon },
  props: {
    axis: { type: String, default: "" },
  },
  data: function () {
    return {
      x_axis_zoom_in: "Zoom-In",
      x_axis_zoom_out: "Zoom-Out",
    };
  },
  computed: {
    ...mapState("waveform", {
      x_zoom_levels: "x_zoom_levels",
    }),
    ...mapState("waveform", {
      zoom_level_idx: "x_zoom_level_idx",
    }),
    ...mapState("playback", {
      tooltips_delay: "tooltips_delay",
    }),
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
      this.$store.commit("stimulation/handle_zoom_in", this.axis);
    },
    zoom_x_out() {
      this.$store.commit("stimulation/handle_zoom_out", this.axis);
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
  position: absolute;
  top: 0px;
  left: 0px;
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
.span__playback-x-axis-controls-zoom-out-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  padding-right: 11px;
  font-size: 20px;
  left: 160px;
}
.span__playback-x-axis-controls-zoom-in-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  font-size: 20px;
  left: 155px;
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
.popover-header {
  font-weight: 700;
  background-color: #f7f7f7;
  font-size: 11px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}
.popover-body {
  font-weight: 400;
  color: #000000;
  background-color: #ffffff;
  font-size: 11px;
  font-family: Muli;
  -webkit-font-smoothing: antialiased;
}
span:hover {
  color: rgb(120, 120, 120);
}
</style>
