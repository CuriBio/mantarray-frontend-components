<template>
  <div>
    <!-- prettier-ignore -->
    <span class="span__heatmap-scale-higher-value" >{{ gradient_range_max }} {{ units }}</span>
    <div class="div__heatmap-gradient-holder" :style="cssProps"></div>
    <!-- prettier-ignore -->
    <span class="span__heatmap-scale-lower-value" :style="top_shift" > {{ gradient_range_min }} {{ units }}</span>
  </div>
</template>

<script>
/**
 * @vue-prop {String} gradient_uuid  - Current uuid for the heatmapcolorbar
 * @vue-prop {Number} lower_range    - Lower range value of heatmapcolorbar  (This prop is  required)
 * @vue-prop {Number} upper_range    - Upper range value of heatmapcolorbar    (This prop is  required)
 * @vue-prop {Array}  gradient_range - Array of Object which contains color and offset of heatmapcolorbar
 * @vue-prop {Number} heatmap_height - Height value of the heatmapcolorbar (This prop is  required)
 * @vue-prop {String} units          - Units used to measure the heatmapcolorbar (This prop is  required)
 **/
import { mapState, mapGetters } from "vuex";

export default {
  name: "GradientBar",
  props: {
    gradient_height: {
      type: Number,
      required: true,
    },
    gradient_width: {
      type: Number,
      required: true,
    },
    units: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState("gradient", ["gradient", "gradient_range_max", "gradient_range_min"]),
    ...mapGetters("gradient", ["gradient_range"]),
    top_shift() {
      return "top: " + (this.gradient_height - 16).toString() + "px;";
    },
    cssProps() {
      return {
        height: this.gradient_height + "px",
        width: this.gradient_width + "px",
        background: "linear-gradient(to top, " + this.gradient.steps.join(", ") + ")",
      };
    },
  },
};
</script>
<style type="text/css">
.div__heatmap-gradient-holder {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  position: absolute;
  width: 41px;
  top: 0px;
  left: 0px;
  visibility: visible;
  box-shadow: none;
  pointer-events: all;
}

.span__heatmap-scale-higher-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 92px;
  height: 22px;
  top: 0px;
  left: 45px;
  padding: 2px;
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

.span__heatmap-scale-lower-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 92px;
  height: 22px;
  left: 42px;
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
